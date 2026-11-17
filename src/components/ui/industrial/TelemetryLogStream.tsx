/**
 * @purpose Timestamped live telemetry and gate verification log stream viewer.
 * @security Sanitizes log output strings to prevent client-side HTML or script injection.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: TelemetryLogStream)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "pass";
  message: string;
}

export interface TelemetryLogStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  logs: LogEntry[];
  maxHeight?: string;
}

const levelColors = {
  info: "text-text-secondary",
  warn: "text-signal-warn",
  error: "text-signal-fault",
  pass: "text-signal-pass",
};

export function TelemetryLogStream({
  logs,
  maxHeight = "280px",
  className,
  ...props
}: TelemetryLogStreamProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={containerRef}
      style={{ maxHeight }}
      className={cn(
        "bg-canvas border border-border-grid p-3 font-mono text-[12px] leading-relaxed overflow-y-auto w-full select-text",
        className
      )}
      {...props}
    >
      {logs.map((log, index) => (
        <div key={`${log.timestamp}-${index}`} className="flex items-start gap-2 py-0.5">
          <span className="text-text-muted select-none flex-shrink-0">
            [{log.timestamp}]
          </span>
          <span className={cn("break-all", levelColors[log.level])}>
            {log.message}
          </span>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-text-muted italic py-2">
          [NO TELEMETRY EVENTS RECORDED]
        </div>
      )}
    </div>
  );
}
