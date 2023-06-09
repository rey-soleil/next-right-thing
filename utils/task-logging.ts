import { TodoistApi } from "@doist/todoist-api-typescript";
import { Session } from "next-auth";
import { Task } from "utils/tasks";
import { toastGoogleCalendarCompletion, toastTodoistCompletion } from "./toast";

export function logToGoogleCalendarAndToast(
  session: Session | null,
  startTime: number | undefined,
  task: Task | undefined
) {
  const googleCalendarPromise = logTaskToGoogleCalendar(
    session,
    startTime,
    task
  );
  if (googleCalendarPromise) {
    toastGoogleCalendarCompletion(googleCalendarPromise, session, task);
  }
}

export function logTaskToGoogleCalendar(
  session: Session | null,
  startTime: number | undefined,
  task: Task | undefined
) {
  if (!session?.user.calendarId || !startTime) {
    return Promise.reject();
  }
  const body = {
    startTime,
    endTime: Date.now(),
    task,
    calendarId: session.user.calendarId,
  };
  const googleCalendarPromise = fetch("/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).catch((err) => console.error(err));
  return googleCalendarPromise;
}

export function closeTodoistTaskAndToast(
  session: Session | null,
  task: Task | undefined
) {
  const todoistPromise = closeTaskInTodoist(session, task);
  if (todoistPromise) {
    toastTodoistCompletion(todoistPromise, task);
  }
}

export function closeTaskInTodoist(
  session: Session | null,
  task: Task | undefined
) {
  if (!task || !task.id || !session?.user.todoistAPIToken) {
    return null;
  }
  const todoistApi = new TodoistApi(session.user.todoistAPIToken);
  const todoistPromise = todoistApi
    .closeTask(task.id)
    .catch((err) => console.error(err));
  return todoistPromise;
}
