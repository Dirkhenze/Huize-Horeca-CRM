# Huize Horeca CRM - Lead → Klant Workflow v2.0

## Nieuwe Functionaliteiten

### 1️⃣ Automatisch Tijdelijk Klantnummer
Bij het aanmaken van een nieuwe lead wordt automatisch een uniek tijdelijk klantnummer gegenereerd:

- **Formaat**: `LEAD000001`, `LEAD000002`, `LEAD000003`, etc.
- **Automatisch**: Gegenereerd via database trigger bij INSERT
- **Uniek**: Elk lead krijgt een uniek oplopend nummer
- **Permanent**: Blijft bewaard in `lead_referentie` veld bij conversie naar klant

### 2️⃣ Dynamisch Klantformulier met 6 Secties

Het formulier is verdeeld in 6 logische secties met progressieve validatie:

#### Sectie 1: Basisgegevens (Verplicht voor alle leads)
- Bedrijfsnaam *
- Klanttype
- Accountmanager *

#### Sectie 2: Adresgegevens (Verplicht vanaf Offerte-fase)
- Straat & huisnummer
- Postcode
- Plaats
- Regio
- Leveradres (indien afwijkend)

#### Sectie 3: Leveringsinformatie (Verplicht vanaf Offerte-fase)
- Voorkeur leveringsdagen
- Tijdvakken
- Leveringsinstructies

#### Sectie 4: Contactpersonen (Minimaal 1 contactpersoon)
- Primair contact: Naam *, Rol, Telefoon, Email
- Secundair contact (optioneel)

#### Sectie 5: Financiële gegevens (Verplicht voor Klant actief-status)
- IBAN
- T.N.V. (tenaamstelling)
- Betaalconditie
- BTW-nummer

#### Sectie 6: Business informatie (Optioneel)
- Assortimentsinteresse
- Business opmerkingen

### 3️⃣ Automatische Data-overname bij Conversie

Wanneer een lead wordt geconverteerd naar klant:
- Alle ingevulde velden worden automatisch overgenomen
- Het LEAD-nummer wordt bewaard in `lead_referentie` veld
- Lead-status wordt bijgewerkt naar "Klant actief"
- Nieuwe customer record wordt aangemaakt met alle data

## Database Setup

### Stap 1: Voer SQL Script uit

Open de Supabase SQL Editor:
```
https://supabase.com/dashboard/project/tfgttzedzrcehyxxyjwq/sql/new
```

Voer het script uit dat in `COMPLETE_WORKFLOW_SETUP.sql` staat.

### Wat doet het script?

1. **Basis tabellen**:
   - `companies` - Bedrijven
   - `team_members` - Accountmanagers
   - `leads` - Leads met alle 6 secties
   - `customers` - Klanten met `lead_referentie`
   - `user_companies` - User-bedrijf koppeling
   - `lead_sequence` - Teller voor LEAD-nummers

2. **Auto-increment functie**:
   - `generate_lead_number()` - Genereert unieke LEAD000001 nummers
   - `auto_generate_lead_number()` - Trigger die automatisch nummer toekent

3. **Row Level Security**:
   - RLS is ingeschakeld op alle tabellen
   - Tijdelijk open policies voor development

4. **Demo data**:
   - Huize Horeca Demo company
   - 8 Accountmanagers vooraf ingeladen

## UI Features

### LEAD-nummer Header
Het tijdelijke LEAD-nummer is prominent zichtbaar in de formulier header:
- Oranje kleur voor herkenbaarheid
- Altijd zichtbaar (sticky header)
- Toont huidige status
- Font-mono styling voor leesbaarheid

### Progressieve Validatie
De vereiste velden veranderen op basis van de status:
- **Lead**: Alleen basis + 1 contactpersoon
- **Offerte**: + Adres + Levering
- **Klant actief**: + Financieel verplicht

### Sectie Indicatoren
Elk sectie heeft een gekleurde badge:
1. 🟠 Oranje - Basis
2. 🔵 Blauw - Adres
3. 🟢 Groen - Levering
4. 🟣 Paars - Contact
5. 🟡 Geel - Financieel
6. 🔷 Indigo - Business

## Code Structuur

### Nieuwe Bestanden
- `src/lib/leadToCustomerConversion.ts` - Conversie logica
- `COMPLETE_WORKFLOW_SETUP.sql` - Database setup
- `WORKFLOW_V2_README.md` - Deze documentatie

### Aangepaste Bestanden
- `src/components/pages/contacten/LeadForm.tsx` - Dynamisch formulier
- `src/lib/types.ts` - Uitgebreide Lead interface

## Gebruik in de Applicatie

### Nieuwe Lead Aanmaken
1. Ga naar Contacten → Lead Management
2. Klik "Nieuwe Lead"
3. Vul minimaal: Bedrijfsnaam, Accountmanager, Contactpersoon
4. Systeem genereert automatisch LEAD000001 (of volgend nummer)
5. LEAD-nummer verschijnt in oranje header

### Lead Bewerken
1. Alle secties zijn toegankelijk
2. Progressieve validatie geeft aan wat verplicht is
3. Wijzigingen worden direct opgeslagen

### Lead Converteren naar Klant
1. Status wijzigen naar "Klant actief"
2. Vul financiële gegevens aan (verplicht)
3. Gebruik `convertLeadToCustomer()` functie:

```typescript
import { convertLeadToCustomer } from './lib/leadToCustomerConversion';

const result = await convertLeadToCustomer(lead);
if (result.success) {
  console.log('Klant aangemaakt:', result.customerId);
}
```

## Data Flow

```
1. Lead aangemaakt
   ↓
   Trigger genereert LEAD000001
   ↓
2. Lead bewerkt (status: Lead → Offerte)
   ↓
   Progressieve validatie activeert Adres + Levering
   ↓
3. Offerte geaccepteerd (status: Klant actief)
   ↓
   Financieel verplicht
   ↓
4. Lead → Customer conversie
   ↓
   Alle data wordt overgenomen
   ↓
   lead_referentie = LEAD000001
   ↓
5. Klant actief in systeem
```

## API Referentie

### Database Functies

```sql
-- Genereer nieuw LEAD-nummer
SELECT generate_lead_number();
-- Output: LEAD000001

-- Controleer laatste nummer
SELECT last_number FROM lead_sequence;
```

### TypeScript Functies

```typescript
// Converteer lead naar klant
convertLeadToCustomer(lead: Lead): Promise<ConversionResult>

// ConversionResult interface
{
  success: boolean;
  customerId?: string;
  error?: string;
}
```

## Troubleshooting

### LEAD-nummer wordt niet gegenereerd
- Controleer of trigger `trigger_auto_lead_number` bestaat
- Verifieer `lead_sequence` tabel heeft 1 row

### Conversie faalt
- Controleer of alle verplichte velden zijn ingevuld
- Verifieer company_id bestaat in customers tabel
- Check RLS policies

### Accountmanagers niet zichtbaar
- Voer SQL script uit om demo accountmanagers toe te voegen
- Controleer `team_members` tabel

## Volgende Stappen

1. Voer SQL script uit in Supabase
2. Refresh de applicatie
3. Test nieuwe lead aanmaken → zie LEAD-nummer
4. Vul formulier in per sectie
5. Converteer naar klant en verifieer data-overname

## Contact & Support

Voor vragen over de nieuwe workflow, neem contact op met het ontwikkelteam.
