"use client";

import { Task } from "@doist/todoist-api-typescript";
import Input from "@mui/material/Input";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import Todoist from "./todoist/page";

const roboto = Roboto({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const [eventName, setEventName] = useState<string | undefined>();

  const [selectingTodoistTasks, setSelectingTodoistTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  console.log({ eventName, selectingTodoistTasks, selectedTask });

  return (
    <main className={styles.main}>
      <h2 className={roboto.className}>What’s the next right thing?</h2>
      {!selectingTodoistTasks && (
        <Input
          placeholder="type it here"
          onChange={({ target }) => setEventName(target.value)}
          sx={{ color: "white", fontSize: "45px", alignContent: "center" }}
        ></Input>
      )}
      {!eventName && !selectingTodoistTasks && (
        <>
          <h2 className={roboto.className}>
            <i>or</i>
          </h2>
          <div
            className={`${roboto.className} ${styles.todoistButton}`}
            onClick={() => setSelectingTodoistTasks(true)}
          >
            <p className={styles.todoistButtonText}>
              choose from Todoist tasks
            </p>
          </div>
        </>
      )}
      {!eventName && selectingTodoistTasks && (
        <Todoist
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      )}
      {(eventName || selectedTask) && (
        <div className={`${roboto.className} ${styles.todoistButton}`}>
          <Link
            href={`/stopwatch?eventName=${eventName}&task=${JSON.stringify({
              id: selectedTask?.id,
              content: selectedTask?.content,
            })}`}
          >
            <p className={styles.todoistButtonText}>next</p>
          </Link>
        </div>
      )}
    </main>
  );
}
