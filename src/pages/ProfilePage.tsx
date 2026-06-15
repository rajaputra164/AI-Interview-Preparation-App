import { FormEvent, useEffect, useState } from 'react';
import api from '@/api/client';
import { useAuth } from '@/context/AuthContext';

export function ProfilePage() {
  const { profile, refreshSession } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    education: '',
    skills: '',
    experienceLevel: 'beginner',
    targetRoles: '',
    bio: ''
  });

  useEffect(() => {
    if (profile) {
      setForm({
        education: String(profile.education ?? ''),
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        experienceLevel: String(profile.experienceLevel ?? 'beginner'),
        targetRoles: Array.isArray(profile.targetRoles) ? profile.targetRoles.join(', ') : '',
        bio: String(profile.bio ?? '')
      });
    }
  }, [profile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await api.put('/profile/me', {
      education: form.education,
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      experienceLevel: form.experienceLevel,
      targetRoles: form.targetRoles.split(',').map((item) => item.trim()).filter(Boolean),
      bio: form.bio
    });
    await refreshSession();
    setSaving(false);
  }

  return (
    <form className="card max-w-4xl space-y-4" onSubmit={handleSubmit}>
      <div className="section-title">Profile management</div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" value={form.education} onChange={(event) => setForm({ ...form, education: event.target.value })} placeholder="B.Tech Computer Science" />
        <select className="input" value={form.experienceLevel} onChange={(event) => setForm({ ...form, experienceLevel: event.target.value })}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <input className="input" value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} placeholder="React, Node.js, SQL" />
      <input className="input" value={form.targetRoles} onChange={(event) => setForm({ ...form, targetRoles: event.target.value })} placeholder="Frontend Developer, Full Stack Engineer" />
      <textarea className="input min-h-40" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Add a short summary about your goals and background" />
      <button className="button-primary" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save profile'}</button>
    </form>
  );
}