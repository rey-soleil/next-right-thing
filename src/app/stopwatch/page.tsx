"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

const roboto = Roboto({ subsets: ["latin"], weight: "700" });

type StopwatchParams = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function formatAsString(time: number) {
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  let timeString =
    hours > 0 ? `${(hours % 24).toString().padStart(2, "0")}:` : "";
  return timeString.concat(
    `${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`
  );
}

export default function Stopwatch({ searchParams }: StopwatchParams) {
  const [startTime, setStartTime] = useState<number | null>();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  let { eventName, task } = searchParams;

  if (eventName === "undefined") eventName = undefined;
  if (task === "undefined") task = undefined;
  if (task) task = JSON.parse(task);

  useEffect(() => {
    const maybeStartTime = window.localStorage.getItem("startTime");
    if (maybeStartTime) {
      const startTime = Number(maybeStartTime);
      setStartTime(startTime);
      setIntervalId(
        setInterval(() => {
          setTimeElapsed(new Date().valueOf() - startTime);
        }, 1000)
      );
    }
  }, [startTime]);

  const startStopwatch = () => {
    const time = new Date().valueOf();
    window.localStorage.setItem("startTime", time.toString());
    setStartTime(time);
  };

  const clearStopwatch = () => {
    window.localStorage.removeItem("startTime");
    setStartTime(null);
    setTimeElapsed(0);

    intervalId && clearInterval(intervalId);
    setIntervalId(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.eventNameChip}>
        <h1 className={roboto.className}>
          {eventName ? eventName : task ? task.content : ""}
        </h1>
      </div>
      <div className={`${roboto.className} ${styles.bigClockText}`}>
        {formatAsString(timeElapsed)}
      </div>
      {!startTime && (
        <div className={`${roboto.className} ${styles.todoistButton}`}>
          <p className={styles.todoistButtonText} onClick={startStopwatch}>
            start
          </p>
        </div>
      )}
      {startTime && (
        <div className={styles.stopwatchButtons}>
          <div className={`${roboto.className} ${styles.todoistButton}`}>
            <p className={styles.todoistButtonText} onClick={clearStopwatch}>
              clear
            </p>
          </div>
          <div className={`${roboto.className} ${styles.todoistButton}`}>
            <Link
              href={`confirm?startTime=${startTime}&timeElapsed=${timeElapsed}&eventName=${eventName}&task=${JSON.stringify(
                task
              )}`}
            >
              <p className={styles.todoistButtonText} onClick={clearStopwatch}>
                finish
              </p>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
