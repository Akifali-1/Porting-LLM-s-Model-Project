import { LlamaContext } from './types';
import { handleCalendarEvent } from '../tasks/calendar';
import { handleQA } from '../tasks/qa';
import { handleCall } from '../tasks/call';
import { handleContactCall } from '../tasks/ContactCall';
import { handleOpenApp } from '../tasks/openApp';
import { handleAlarm } from '../tasks/alarm';

export const routeTask = async (
  input: string,
  context: LlamaContext,
  saveTaskToHistory?: (input: string, taskType: string) => Promise<void>
): Promise<string> => {
  const lowerInput = input.toLowerCase();

  const calendarKeywords = [
    'event',
    'set appointment',
    'appointment date',
    'calendar entry',
    'add to calendar',
    'create event',
    'reminder for',
    'book meeting',
    'schedule',
    'reminder',
    'meeting at',
    'schedule',
    'today',
    'tomorrow',
  ];

  const alarmKeywords = [
    'alarm',
    'set alarm',
    'add alarm',
    'alarm at',
    'wake up',
    'add an alarm',
    'add a alarm',
  ];

  if (alarmKeywords.some(keyword => lowerInput.includes(keyword))) {
    if (saveTaskToHistory) {
      await saveTaskToHistory(input, 'Alarm');
    }
    return await handleAlarm(context, input);
  }

  if (calendarKeywords.some(keyword => lowerInput.includes(keyword))) {
    if (saveTaskToHistory) {
      await saveTaskToHistory(input, 'Calendar');
    }
    return await handleCalendarEvent(context, input);
  }

  if (lowerInput.includes('call') || lowerInput.includes('call to')) {
    const numberMatch = input.match(/\d{10,}/);
    if (numberMatch) {
      if (saveTaskToHistory) {
        await saveTaskToHistory(input, 'Call');
      }
      return await handleCall(context, input);
    } else {
      if (saveTaskToHistory) {
        await saveTaskToHistory(input, 'ContactCall');
      }
      return await handleContactCall(context, input);
    }
  }

  if (lowerInput.startsWith('open ') || lowerInput.includes('open app')) {
    if (saveTaskToHistory) {
      await saveTaskToHistory(input, 'OpenApp');
    }
    return await handleOpenApp(context, input);
  }

  return await handleQA(context, input);
};