import React, { useEffect, useState } from 'react';
import { supabase, Activity, Company, Contact, Deal } from '../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
  { value: 'note', label: 'Note' },
];

export function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'note',
    title: '',
    description: '',
    company_id: '',
    contact_id: '',
    deal_id: '',
    due_date: '',
    assigned_to: '',
  });

  useEffect(() => {
    fetchActivities();
    fetchCompanies();
    fetchContacts();
    fetchDeals();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const submitData = {
        ...formData,
        company_id: formData.company_id || null,
        contact_id: formData.contact_id || null,
        deal_id: formData.deal_id || null,
        due_date: formData.due_date || null,
        assigned_to: formData.assigned_to || user.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from('activities')
          .update({ ...submitData, updated_at: new Date().toISOString() })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([{ ...submitData, created_by: user.id }]);

        if (error) throw error;
      }

      resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleToggleComplete = async (activity: Activity) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({
          completed: !activity.completed,
          completed_at: !activity.completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activity.id);

      if (error) throw error;
      fetchActivities();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setFormData({
      type: activity.type,
      title: activity.title,
      description: activity.description,
      company_id: activity.company_id || '',
      contact_id: activity.contact_id || '',
      deal_id: activity.deal_id || '',
      due_date: activity.due_date ? activity.due_date.split('T')[0] : '',
      assigned_to: activity.assigned_to || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'note',
      title: '',
      description: '',
      company_id: '',
      contact_id: '',
      deal_id: '',
      due_date: '',
      assigned_to: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getRelatedInfo = (activity: Activity) => {
    const related = [];
    if (activity.company_id) {
      const company = companies.find((c) => c.id === activity.company_id);
      if (company) related.push(company.name);
    }
    if (activity.contact_id) {
      const contact = contacts.find((c) => c.id === activity.contact_id);
      if (contact) related.push(`${contact.first_name} ${contact.last_name}`);
    }
    if (activity.deal_id) {
      const deal = deals.find((d) => d.id === activity.deal_id);
      if (deal) related.push(deal.title);
    }
    return related.join(' • ');
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading activities...</div>;
  }

  const pendingActivities = activities.filter((a) => !a.completed);
  const completedActivities = activities.filter((a) => a.completed);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Activities</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Activity' : 'New Activity'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <select
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
              <select
                value={formData.contact_id}
                onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deal</label>
              <select
                value={formData.deal_id}
                onChange={(e) => setFormData({ ...formData, deal_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {deals.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Pending ({pendingActivities.length})
          </h3>
          <div className="space-y-2">
            {pendingActivities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p>No pending activities. All caught up!</p>
              </div>
            ) : (
              pendingActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(activity)}
                      className="mt-1 text-slate-400 hover:text-green-600 transition"
                    >
                      <Circle className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{activity.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium uppercase">
                              {activity.type}
                            </span>
                            {activity.due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(activity.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {getRelatedInfo(activity) && (
                            <p className="text-sm text-slate-600 mt-1">
                              {getRelatedInfo(activity)}
                            </p>
                          )}
                          {activity.description && (
                            <p className="text-sm text-slate-600 mt-2">{activity.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(activity)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(activity.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {completedActivities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Completed ({completedActivities.length})
            </h3>
            <div className="space-y-2">
              {completedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4 opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(activity)}
                      className="mt-1 text-green-600 hover:text-slate-400 transition"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-700 line-through">
                            {activity.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <span className="px-2 py-0.5 bg-slate-200 rounded text-xs font-medium uppercase">
                              {activity.type}
                            </span>
                            {activity.completed_at && (
                              <span>
                                Completed {new Date(activity.completed_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
