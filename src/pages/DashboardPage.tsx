import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { deleteTest, getTests } from '../api/tests';
import { getErrorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { TestListItem } from '../types';
import styles from './DashboardPage.module.css';

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() ?? 'draft';
  return (
    <span className={`${styles.badge} ${styles[normalized] || styles.draft}`}>
      {normalized}
    </span>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: tests = [], isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: getTests,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      setDeleteId(null);
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.status?.toLowerCase().includes(q),
    );
  }, [tests, search]);

  const handleDelete = async (test: TestListItem) => {
    if (
      !window.confirm(
        `Delete "${test.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleteId(test.id);
    try {
      await deleteMutation.mutateAsync(test.id);
    } catch (err) {
      alert(getErrorMessage(err));
      setDeleteId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div>
          <h1>Test Dashboard</h1>
          <p className={styles.subtitle}>Manage and publish your tests</p>
        </div>
        <Button onClick={() => navigate('/tests/new')}>+ Create New Test</Button>
      </div>

      <div className={styles.toolbar}>
        <Input
          placeholder="Search by name, subject, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      {isLoading ? (
        <div className={styles.state}>Loading tests...</div>
      ) : error ? (
        <div className={styles.stateError}>{getErrorMessage(error)}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No tests found.</p>
          <Button onClick={() => navigate('/tests/new')}>Create your first test</Button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Subject</th>
                <th>Topics</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((test) => (
                <tr key={test.id}>
                  <td className={styles.nameCell}>{test.name}</td>
                  <td>{test.subject}</td>
                  <td className={styles.topicsCell}>
                    {test.topics?.length
                      ? test.topics.join(', ')
                      : '—'}
                  </td>
                  <td>
                    <StatusBadge status={test.status} />
                  </td>
                  <td>
                    {test.created_at
                      ? format(new Date(test.created_at), 'MMM d, yyyy')
                      : '—'}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/tests/${test.id}/preview`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/tests/${test.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deleteId === test.id}
                        onClick={() => handleDelete(test)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
