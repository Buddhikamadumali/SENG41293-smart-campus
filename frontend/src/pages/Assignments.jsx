import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, BookOpen, X } from 'lucide-react';

const API_BASE = 'http://localhost:3001';
const FILTERS = ['All', 'Pending', 'Completed'];

const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Overdue', color: 'text-red-500' };
  if (diff === 0) return { label: 'Due today!', color: 'text-red-500' };
  if (diff === 1) return { label: 'Due tomorrow', color: 'text-orange-500' };
  return { label: `${diff} days left`, color: 'text-gray-400' };
};

const SUBJECTS = [
  'Mobile Web Application Development',
  'Distributed and Cloud Computing',
  'Big Data Infrastructure',
  'Software Evolution',
  'Software Metrics and Measurements',
  'Mobile Computing Technologies',
  'Advanced Web Applications Development',
];

const SUBJECT_CREDITS = {
  'Mobile Web Application Development': 3,
  'Distributed and Cloud Computing': 3,
  'Big Data Infrastructure': 3,
  'Software Evolution': 3,
  'Software Metrics and Measurements': 3,
  'Mobile Computing Technologies': 3,
  'Advanced Web Applications Development': 3,
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: SUBJECTS[0],
    dueDate: '',
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${API_BASE}/assignments`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setAssignments(data);
        calculateAndSaveCredits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const calculateAndSaveCredits = (updatedAssignments) => {
    const completedSubjects = [
      ...new Set(
        updatedAssignments
          .filter(a => a.status === 'completed')
          .map(a => a.subject)
      )
    ];

    const totalCompleted = completedSubjects.reduce((sum, subject) => {
      return sum + (SUBJECT_CREDITS[subject] || 0);
    }, 0);

    const stored = localStorage.getItem('profile');
    const profile = stored
      ? JSON.parse(stored)
      : { completedCredits: 0, totalCredits: 120 };

    localStorage.setItem('profile', JSON.stringify({
      ...profile,
      completedCredits: totalCompleted,
    }));
  };

  const addAssignment = async () => {
    if (!newAssignment.title.trim() || !newAssignment.dueDate) return;

    const newItem = {
      title: newAssignment.title.trim(),
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      status: 'pending',
    };

    try {
      const res = await fetch(`${API_BASE}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const created = await res.json();
      const newAssignments = [...assignments, created];
      setAssignments(newAssignments);
      calculateAndSaveCredits(newAssignments);
    } catch (err) {
      console.error('Add failed:', err);
    }

    setNewAssignment({ title: '', subject: SUBJECTS[0], dueDate: '' });
    setShowModal(false);
  };

  const toggleStatus = async (id) => {
    const assignment = assignments.find(a => a.id === id);
    const newStatus = assignment.status === 'pending' ? 'completed' : 'pending';

    try {
      const res = await fetch(`${API_BASE}/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      const newAssignments = assignments.map(a => a.id === id ? updated : a);
      setAssignments(newAssignments);
      calculateAndSaveCredits(newAssignments); 
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const confirmDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      await fetch(`${API_BASE}/assignments/${assignmentToDelete}`, {
        method: 'DELETE',
      });
      const newAssignments = assignments.filter(a => a.id !== assignmentToDelete);
      setAssignments(newAssignments);
      calculateAndSaveCredits(newAssignments);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setAssignmentToDelete(null);
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'Pending') return a.status === 'pending';
    if (filter === 'Completed') return a.status === 'completed';
    return true;
  });

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-500">
      <p className="font-medium">Failed to load assignments</p>
      <p className="text-sm mt-1">Make sure json-server is running</p>
    </div>
  );

  return (
    <div className="space-y-4">

      <div>
        <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
        <p className="text-sm text-gray-400 mt-0.5">{pendingCount} pending · {completedCount} completed</p>
      </div>

      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {f}
            {f === 'Pending' && pendingCount > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-orange-100 text-orange-600'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <p className="text-4xl mb-3">{filter === 'Completed' ? '🎯' : '📋'}</p>
          <p className="text-gray-500 font-medium">
            {filter === 'Completed' ? 'Nothing completed yet' : 'No assignments here'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === 'Pending' ? 'All caught up!' : 'Tap + to add one'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map(a => {
            const due = getDaysUntilDue(a.dueDate);
            const isCompleted = a.status === 'completed';
            return (
              <div
                key={a.id}
                className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden ${
                  isCompleted ? 'border-green-100 opacity-75' : 'border-gray-100'
                }`}
              >
                <div className="p-4 flex items-start gap-3">
                  <button
                    onClick={() => toggleStatus(a.id)}
                    className="mt-0.5 shrink-0 transition-transform active:scale-90"
                  >
                    {isCompleted
                      ? <CheckCircle2 size={22} className="text-green-500" />
                      : <Circle size={22} className="text-gray-300" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm leading-snug ${
                      isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}>
                      {a.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <BookOpen size={12} className="text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-400 truncate">{a.subject}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(a.dueDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                      {!isCompleted && (
                        <span className={`text-xs font-medium ${due.color}`}>
                          {due.label}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-xs font-medium text-green-500">Done ✓</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setAssignmentToDelete(a.id)}
                    className="shrink-0 p-1.5 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className={`h-0.5 ${isCompleted ? 'bg-green-400' : 'bg-orange-300'}`} />
              </div>
            );
          })}
        </div>
      )}

      {!showModal && !assignmentToDelete && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        >
          <Plus size={26} />
        </button>
      )}

      {assignmentToDelete && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-6">
          <div className="bg-white w-full rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-50 px-5 py-5 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Delete Assignment?</h3>
              <p className="text-sm text-gray-500 mt-1">
                {assignments.find(a => a.id === assignmentToDelete)?.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex divide-x divide-gray-100">
              <button
                onClick={() => setAssignmentToDelete(null)}
                className="flex-1 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAssignment}
                className="flex-1 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full rounded-2xl shadow-xl flex flex-col" style={{ maxHeight: '80vh' }}>

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-800">New Assignment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab Report Week 5"
                  value={newAssignment.title}
                  onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Subject
                </label>
                <select
                  value={newAssignment.subject}
                  onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={addAssignment}
                disabled={!newAssignment.title.trim() || !newAssignment.dueDate}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                Add Assignment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}