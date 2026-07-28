import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { LeadSubmission } from '../../types';
import {
  Users, Search, Download, Trash2, Phone, Mail, Plus, Filter,
  CheckCircle2, Clock, Calendar, FileText, CheckSquare, Square, RefreshCw, UserCheck
} from 'lucide-react';

export const LeadManagementView: React.FC = () => {
  const {
    leads, addLeadManual, updateLeadStatus, updateLeadDetails,
    deleteLead, bulkDeleteLeads, bulkStatusLeads
  } = useLeads();

  const [leadFilterTab, setLeadFilterTab] = useState<'All' | 'New' | 'Today' | 'Follow-up' | 'Contacted' | 'Closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  
  // Lead Details / Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadSubmission | null>(null);
  const [leadHistoryList, setLeadHistoryList] = useState<any[]>([]);

  // Add Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: 'Buy',
    budget: '₹ 75 Lakhs - ₹ 1 Cr',
    preferredArea: 'Nerul East',
    propertyType: '2 BHK',
    message: '',
    status: 'New' as LeadSubmission['status'],
    notes: '',
    assignedTo: 'Unassigned',
    followUpDate: ''
  });

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.preferredArea && l.preferredArea.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (leadFilterTab === 'New') return l.status === 'New';
    if (leadFilterTab === 'Contacted') return l.status === 'Contacted';
    if (leadFilterTab === 'Closed') return l.status === 'Closed';
    if (leadFilterTab === 'Follow-up') return l.status === 'Follow-up';
    if (leadFilterTab === 'Today') return l.timestamp && l.timestamp.includes(new Date().toISOString().slice(0, 10));

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected leads?`)) {
      await bulkDeleteLeads(selectedLeadIds);
      setSelectedLeadIds([]);
    }
  };

  const handleBulkStatus = async (status: LeadSubmission['status']) => {
    if (selectedLeadIds.length === 0) return;
    await bulkStatusLeads(selectedLeadIds, status);
    setSelectedLeadIds([]);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Requirement', 'Budget', 'Area', 'Property Type', 'Message', 'Lead Source', 'CTA Source', 'Page', 'Timestamp', 'Status', 'Notes', 'Assigned To', 'Follow Up Date'];
    const rows = (selectedLeadIds.length > 0 ? leads.filter(l => selectedLeadIds.includes(l.id)) : leads).map(l => [
      l.id, l.name, l.phone, l.email || '', l.requirement || '', l.budget || '', l.preferredArea || '', l.propertyType || '',
      `"${(l.message || '').replace(/"/g, '""')}"`, l.lead_source, l.cta_source, l.page_name, l.timestamp, l.status,
      `"${(l.notes || '').replace(/"/g, '""')}"`, l.assignedTo || 'Unassigned', l.followUpDate || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Jayshree_Realty_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;
    await addLeadManual(newLeadForm);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '', phone: '', email: '', requirement: 'Buy', budget: '₹ 75 Lakhs - ₹ 1 Cr',
      preferredArea: 'Nerul East', propertyType: '2 BHK', message: '', status: 'New', notes: '', assignedTo: 'Unassigned', followUpDate: ''
    });
  };

  const handleSaveLeadEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    await updateLeadDetails(editingLead.id, editingLead);
    setEditingLead(null);
  };

  return (
    <div className="space-y-6 font-outfit">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Lead Management <span className="text-[#c5a059]">& Pipeline</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real estate buyer & seller inquiries with status tracking, agent assignment, notes, and follow-ups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Lead Manually
          </button>
          <button
            onClick={exportCSV}
            className="bg-[#0d1527] border border-[#c5a059]/40 hover:border-[#c5a059] text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#c5a059]" /> Export CSV ({selectedLeadIds.length || leads.length})
          </button>
        </div>
      </div>

      {/* Filters & Bulk Actions Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#0d1527] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'New', 'Today', 'Follow-up', 'Contacted', 'Closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setLeadFilterTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                leadFilterTab === tab ? 'bg-[#c5a059] text-black shadow-md font-bold' : 'bg-[#070b19] text-slate-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, area..."
            className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Bulk Operations Bar when rows are selected */}
      {selectedLeadIds.length > 0 && (
        <div className="p-3 bg-[#0a1022] border border-[#c5a059]/40 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-[#e5c178]">
            {selectedLeadIds.length} Leads Selected
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Set Status:</span>
            {(['New', 'Follow-up', 'Contacted', 'Closed'] as const).map(st => (
              <button
                key={st}
                onClick={() => handleBulkStatus(st)}
                className="px-2.5 py-1 rounded bg-[#070b19] border border-slate-700 hover:border-[#c5a059] text-slate-200 text-[11px]"
              >
                {st}
              </button>
            ))}
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-950/60 border border-red-500/40 text-red-300 rounded font-bold hover:bg-red-900"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Leads Data Table */}
      <div className="bg-[#0d1527] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#080d19] text-slate-400 border-b border-slate-800 font-serif">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={toggleSelectAll}>
                    {selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#c5a059]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-bold">Client & Phone</th>
                <th className="p-4 font-bold">Requirement</th>
                <th className="p-4 font-bold">Source / Page</th>
                <th className="p-4 font-bold">Follow Up Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#091122] transition-colors">
                  <td className="p-4">
                    <button onClick={() => toggleSelectLead(lead.id)}>
                      {selectedLeadIds.includes(lead.id) ? (
                        <CheckSquare className="w-4 h-4 text-[#c5a059]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{lead.name}</div>
                    <div className="font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#c5a059]" /> {lead.phone}
                    </div>
                    {lead.email && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" /> {lead.email}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-amber-200">{lead.requirement || 'Buy'}</span>
                    <div className="text-[11px] text-slate-400">{lead.preferredArea} • {lead.budget}</div>
                    {lead.message && (
                      <div className="text-[11px] text-slate-400 italic line-clamp-1 mt-1">
                        "{lead.message}"
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-[11px] text-slate-400">
                    <div className="text-slate-200 font-semibold">{lead.lead_source}</div>
                    <div>{lead.cta_source}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{lead.timestamp}</div>
                  </td>
                  <td className="p-4">
                    <input
                      type="date"
                      value={lead.followUpDate || ''}
                      onChange={(e) => updateLeadDetails(lead.id, { followUpDate: e.target.value })}
                      className="bg-[#070b19] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]"
                    />
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`bg-[#070b19] border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                        lead.status === 'New' ? 'border-emerald-500/50 text-emerald-400' :
                        lead.status === 'Follow-up' ? 'border-amber-500/50 text-amber-400' :
                        lead.status === 'Contacted' ? 'border-sky-500/50 text-sky-400' : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                      title="Edit Lead Details & Notes"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-500/30"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No lead submissions matching current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-white">Add Lead Manually</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Requirement</label>
                  <select
                    value={newLeadForm.requirement}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, requirement: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                    <option value="Rent">Rent</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Preferred Area</label>
                  <input
                    type="text"
                    value={newLeadForm.preferredArea}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredArea: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Notes / Message</label>
                <textarea
                  rows={3}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-4 py-2 rounded-xl font-bold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead & Notes Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-white">Edit Lead: {editingLead.name}</h3>
            <form onSubmit={handleSaveLeadEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as any })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Follow Up Date</label>
                  <input
                    type="date"
                    value={editingLead.followUpDate || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, followUpDate: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Lead Notes & Communication Log</label>
                <textarea
                  rows={4}
                  value={editingLead.notes || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  placeholder="Record client discussions, site visit schedules, price negotiation notes..."
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-4 py-2 rounded-xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
