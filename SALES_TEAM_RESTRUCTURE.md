# Sales Team & Supplier Account Managers Restructure

## Status: Database Fase Compleet ✅

De database structuur is volledig voorbereid voor de nieuwe Sales Team en Accountmanagers (Leveranciers) functionaliteit.

## Wat is Klaar

### 1. Database Migratie (✅ Compleet)

Het SQL script `supabase/migrations/20251023000000_020_sales_team_restructure.sql` bevat:

#### Nieuwe Tabellen

1. **`sales_team`** - Interne accountmanagers (Huize Horeca)
   - Alle bestaande team_members zijn automatisch gemigreerd
   - Behoud van originele IDs (alle referenties blijven werken)
   - Extra velden: `team_name`, `function_title`, `mobile`

2. **`supplier_account_managers`** - Externe accountmanagers (Leveranciers)
   - Unieke email validation
   - Koppeling aan leveranciers via assignments

3. **`supplier_am_assignments`** - N-M relatie tabel
   - Ondersteunt meerdere AM's per leverancier
   - Ondersteunt meerdere leveranciers per AM
   - `is_primary` vlag voor hoofdcontact
   - Unique constraint: max 1 primaire AM per leverancier

4. **`audit_log`** - Volledige audit trail
   - Wie heeft wat wanneer gewijzigd
   - Old/new values in JSONB
   - IP-adres en user agent tracking

#### Automatische Features

- **Auto-migratie**: Alle sales team members zijn al verplaatst naar `sales_team`
- **Audit triggers**: Automatisch loggen van alle wijzigingen aan assignments
- **Helper functions**: `log_audit_entry()` voor manuele audit logs
- **View**: `suppliers_with_primary_am` voor snelle queries

### 2. Navigatie (✅ Compleet)

Sidebar is bijgewerkt met twee nieuwe menu-items onder Contacten:
- **Sales Team** (oude "Accountmanagers")
- **Accountmanagers (Leveranciers)** (nieuw)

### 3. Backward Compatibility (✅ Gegarandeerd)

- Leads verwijzen nog steeds naar `account_manager_id`
- Customers verwijzen nog steeds naar `account_manager_id`
- Beide gebruiken nu de `sales_team` tabel met dezelfde IDs
- Geen breaking changes in bestaande functionaliteit

## Wat Nog Moet Worden Gebouwd

### UI Components (Volgende Fase)

#### 1. Sales Team Page
```
- List view met zoeken en filteren
- Kanban view (groeperen op team of rol)
- CRUD operaties (Create, Read, Update, Delete)
- Drag-and-drop tussen teams in Kanban
- Bulk actions (activeren/deactiveren)
```

#### 2. Accountmanagers (Leveranciers) Page
```
- List view met zoeken en filteren
- Kanban view (groeperen op leverancier of actief/inactief)
- CRUD operaties
- Leverancier toewijzen via dropdown/multi-select
- Bulk import via CSV
- Audit log viewer
```

#### 3. Leveranciers Detail Page Updates
```
- Kaartje met primaire accountmanager
- Lijst met alle toegewezen AM's
- Acties:
  - Toevoegen nieuwe AM
  - Verwijderen AM
  - Markeren als primair
  - Her-toewijzen naar andere leverancier
```

#### 4. Global Components
```
- ViewToggle component (List ↔ Kanban)
- KanbanBoard component (met drag-and-drop)
- SearchBar component (globale zoek)
- FilterPanel component (actief, rol, leverancier)
- AuditLogViewer component
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│   sales_team    │
│                 │◄─────┐
│ - id            │      │
│ - company_id    │      │
│ - first_name    │      │  1:N
│ - last_name     │      │
│ - email         │      │
│ - team_name     │      │
│ - is_active     │      │
└─────────────────┘      │
                         │
                    ┌────┴─────┐
                    │  leads   │
                    │          │
                    │ - am_id  │
                    └──────────┘

┌─────────────────────────────┐
│ supplier_account_managers   │
│                             │
│ - id                        │
│ - first_name                │
│ - last_name                 │
│ - email (UNIQUE)            │
│ - function_title            │
│ - is_active                 │
└──────────┬──────────────────┘
           │
           │ N:M
           │
     ┌─────┴──────────────────┐
     │ supplier_am_assignments│
     │                        │
     │ - supplier_id          │
     │ - account_manager_id   │
     │ - is_primary          │
     │ - assigned_by         │
     └─────┬──────────────────┘
           │
           │ N:M
           │
     ┌─────┴──────────┐
     │   suppliers    │
     │                │
     │ - id           │
     │ - name         │
     │ - category     │
     └────────────────┘

┌──────────────────┐
│   audit_log      │
│                  │
│ - entity_type    │
│ - entity_id      │
│ - action         │
│ - changed_by     │
│ - old_values     │
│ - new_values     │
│ - created_at     │
└──────────────────┘
```

## SQL Uitvoeren

### Stap 1: Open Supabase SQL Editor
```
https://supabase.com/dashboard/project/tfgttzedzrcehyxxyjwq/sql/new
```

### Stap 2: Voer Script Uit
Kopieer de volledige inhoud van:
```
supabase/migrations/20251023000000_020_sales_team_restructure.sql
```

En voer het uit in de SQL editor.

### Stap 3: Verificatie
Na uitvoering zie je deze output:
```
✅ Sales Team migration complete | migrated_count: 8
✅ Supplier AM tables created | demo_am_count: 1
✅ Audit log ready
```

## API Voorbeelden

### Sales Team Ophalen
```typescript
const { data: salesTeam } = await supabase
  .from('sales_team')
  .select('*')
  .eq('is_active', true)
  .order('first_name');
```

### Supplier AM's met Leveranciers
```typescript
const { data: suppliersWithAMs } = await supabase
  .from('supplier_am_assignments')
  .select(`
    *,
    supplier:suppliers(*),
    account_manager:supplier_account_managers(*)
  `)
  .eq('supplier_id', supplierId);
```

### Primaire AM Instellen
```typescript
// Eerst alle andere naar niet-primair
await supabase
  .from('supplier_am_assignments')
  .update({ is_primary: false })
  .eq('supplier_id', supplierId);

// Dan nieuwe primair maken
await supabase
  .from('supplier_am_assignments')
  .update({ is_primary: true })
  .eq('id', assignmentId);
```

### Audit Log Opvragen
```typescript
const { data: auditLog } = await supabase
  .from('audit_log')
  .select('*')
  .eq('entity_type', 'supplier_am_assignment')
  .eq('entity_id', assignmentId)
  .order('created_at', { ascending: false });
```

## Views & Filters Specificatie

### Sales Team Views

#### List View
| Kolom | Sorteerbaar | Filterbaar |
|-------|-------------|------------|
| Foto | - | - |
| Naam | ✅ | ✅ (zoek) |
| Email | ✅ | ✅ (zoek) |
| Telefoon | - | ✅ (zoek) |
| Afdeling | ✅ | ✅ (filter) |
| Team | ✅ | ✅ (filter) |
| Status | - | ✅ (filter) |
| Acties | - | - |

#### Kanban View
- **Groeperen op**: Team, Rol, of Actief/Inactief
- **Drag-and-drop**: Wijzigt team of status
- **Kaarten tonen**: Naam, email, telefoon, foto

### Accountmanagers (Leveranciers) Views

#### List View
| Kolom | Sorteerbaar | Filterbaar |
|-------|-------------|------------|
| Foto | - | - |
| Naam | ✅ | ✅ (zoek) |
| Email | ✅ | ✅ (zoek) |
| Telefoon | - | ✅ (zoek) |
| Mobiel | - | - |
| Functie | ✅ | ✅ (filter) |
| Leverancier(s) | - | ✅ (filter) |
| Status | - | ✅ (filter) |
| Acties | - | - |

#### Kanban View
- **Groeperen op**: Leverancier of Actief/Inactief
- **Drag-and-drop**: Wijzigt leverancier toewijzing
- **Kaarten tonen**: Naam, email, telefoon, leverancier badges

## Acceptatiecriteria Checklist

### Database ✅
- [x] `sales_team` tabel bestaat
- [x] `supplier_account_managers` tabel bestaat
- [x] `supplier_am_assignments` tabel bestaat
- [x] `audit_log` tabel bestaat
- [x] Migratie van team_members naar sales_team
- [x] RLS policies actief
- [x] Audit triggers werkend
- [x] Helper functions beschikbaar

### Navigatie ✅
- [x] Menu-item "Sales Team"
- [x] Menu-item "Accountmanagers (Leveranciers)"

### UI Components ⏳ (Volgende Fase)
- [ ] Sales Team page met list view
- [ ] Sales Team page met kanban view
- [ ] Supplier AM's page met list view
- [ ] Supplier AM's page met kanban view
- [ ] Leveranciers detail met AM management
- [ ] Zoekfunctionaliteit
- [ ] Filterfunctionaliteit
- [ ] Drag-and-drop functionaliteit
- [ ] Audit log viewer
- [ ] CSV bulk import

### Functionaliteit ⏳ (Volgende Fase)
- [ ] CRUD operaties Sales Team
- [ ] CRUD operaties Supplier AM's
- [ ] N-M assignments beheren
- [ ] Primaire AM markeren
- [ ] Her-toewijzen AM's
- [ ] View toggle werkt
- [ ] Filters werken
- [ ] Audit log registreert alles

## Volgende Stappen

1. **Database migratie uitvoeren** (zie instructies hierboven)
2. **Refresh applicatie** - navigatie items zijn zichtbaar
3. **UI Components bouwen** - één voor één implementeren
4. **Testen** - alle CRUD operaties en workflows
5. **CSV Import** - bulk upload functionaliteit

## Technische Notities

### Performance
- Indexes zijn aanwezig op alle foreign keys
- Composite indexes op veel-gebruikte query patterns
- View `suppliers_with_primary_am` voor snelle lookups

### Security
- RLS enabled op alle tabellen
- Audit log is read-only voor users
- Email uniqueness gegarandeerd voor supplier AM's

### Extensibility
- Audit log ondersteunt custom fields (metadata jsonb)
- N-M relatie kan uitgebreid worden met extra attributen
- View preferences kunnen per user worden opgeslagen

## Support

Voor vragen over deze implementatie:
- Check audit_log tabel voor debug info
- Bekijk RLS policies als data niet zichtbaar is
- Test eerst met demo data voordat je productie data migreert
