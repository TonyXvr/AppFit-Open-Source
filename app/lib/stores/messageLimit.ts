import { atom } from 'nanostores';

// Total allowed user messages per day
const DAILY_MESSAGE_LIMIT = 10;

// Function to get today's date in YYYY-MM-DD format
const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Initialize message count from localStorage
const initializeMessageCount = (): number => {
  if (typeof window === 'undefined') return 0;

  const storedData = localStorage.getItem('daily_message_data');
  if (!storedData) return 0;

  try {
    const data = JSON.parse(storedData);
    const today = getTodayDateString();

    // If we have data for today, return that count
    if (data.date === today) {
      return data.count;
    }

    // If the date is different, it's a new day, so reset the count
    // and update the stored date
    localStorage.setItem('daily_message_data', JSON.stringify({
      date: today,
      count: 0
    }));
    return 0;
  } catch (error) {
    console.error('Error parsing message count data:', error);
    return 0;
  }
};

// Initialize with stored count or default
const initialCount = initializeMessageCount();

// Store for tracking how many user messages have been sent today
export const userMessageCountStore = atom<number>(initialCount);

// Store for tracking if the daily limit has been reached
export const messageLimitReachedStore = atom<boolean>(initialCount >= DAILY_MESSAGE_LIMIT);

// Increment the user message count
export const incrementUserMessageCount = () => {
  // First check if we need to reset for a new day
  const today = getTodayDateString();
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('daily_message_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        // If it's a new day, reset the count
        if (data.date !== today) {
          userMessageCountStore.set(0);
          messageLimitReachedStore.set(false);
          localStorage.setItem('daily_message_data', JSON.stringify({
            date: today,
            count: 0
          }));
        }
      } catch (error) {
        console.error('Error checking date for message limit:', error);
      }
    }
  }

  // Now increment the count
  const currentCount = userMessageCountStore.get();
  const newCount = currentCount + 1;
  userMessageCountStore.set(newCount);

  // Check if daily limit reached
  if (newCount >= DAILY_MESSAGE_LIMIT) {
    messageLimitReachedStore.set(true);
  }

  // Persist to localStorage with today's date
  if (typeof window !== 'undefined') {
    localStorage.setItem('daily_message_data', JSON.stringify({
      date: today,
      count: newCount
    }));
  }

  return newCount;
};

// Get remaining messages for today
export const getRemainingMessages = (): number => {
  const currentCount = userMessageCountStore.get();
  return Math.max(0, DAILY_MESSAGE_LIMIT - currentCount);
};

// Reset the user message count (for testing or admin purposes)
export const resetUserMessageCount = () => {
  userMessageCountStore.set(0);
  messageLimitReachedStore.set(false);

  // Persist to localStorage with today's date
  if (typeof window !== 'undefined') {
    localStorage.setItem('daily_message_data', JSON.stringify({
      date: getTodayDateString(),
      count: 0
    }));
  }
};

// Check if user can send more messages today
export const canSendMoreMessages = (): boolean => {
  return userMessageCountStore.get() < DAILY_MESSAGE_LIMIT;
};
