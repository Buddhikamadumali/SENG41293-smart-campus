import { useEffect } from 'react';

const NOTIFIED_KEY = 'smart_campus_notified';

const requestPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

const getHoursUntilDue = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 0);
  return (due - now) / (1000 * 60 * 60);
};

const checkAndNotify = async () => {
  if (Notification.permission !== 'granted') return;

  let assignments;
  try {
    const res = await fetch('http://localhost:3001/assignments');
    assignments = await res.json();
  } catch (err) {
    console.error('Notification check failed:', err);
    return;
  }

  const notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]');

  assignments
    .filter(a => a.status === 'pending')
    .forEach(a => {
      const hours = getHoursUntilDue(a.dueDate);

      if (hours >= 0 && hours <= 24 && !notified.includes(a.id)) {
        const hoursText = hours < 1
          ? 'less than an hour'
          : `${Math.round(hours)} hours`;

        new Notification('⏰ Assignment Due Soon!', {
          body: `"${a.title}" is due in ${hoursText}.\n${a.subject}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `assignment-${a.id}`,
        });

        localStorage.setItem(
          NOTIFIED_KEY,
          JSON.stringify([...notified, a.id])
        );
      }

      if (hours < 0) {
        const cleaned = notified.filter(id => id !== a.id);
        localStorage.setItem(NOTIFIED_KEY, JSON.stringify(cleaned));
      }
    });
};

export const useDeadlineNotifications = () => {
  useEffect(() => {
    let interval;

    const init = async () => {
      const granted = await requestPermission();
      if (!granted) return;
      
      checkAndNotify();
      interval = setInterval(() => checkAndNotify(), 60 * 1000);
    };

    init();

    return () => clearInterval(interval);
  }, []);
};