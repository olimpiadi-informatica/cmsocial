import type { Task } from "~/lib/api/task";

export function HelpEn({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>How Input and Output Work</h2>
      {io === "grader" && (
        <>
          <p>
            This problem uses graders. You will need to implement a function capable of solving the
            problem; the grader will call your function, automatically handling input reading and
            output writing.
          </p>
          <p>
            For more details, refer to the{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">dedicated guide on graders</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          This is an <i>output-only</i> problem. You will find all the inputs among the problem's
          attachments, and you will need to generate the corresponding output for each one to
          submit. It is not necessary to submit the source code: you can solve the problem using any
          language, without time or memory limits.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Your program will need to read input data from <code>stdin</code> and write output to{" "}
          <code>stdout</code>.
          {taskType === "Communication" && " Make sure to flush the output after each operation."}
        </p>
      )}
      {io === "input.txt / output.txt" && (
        <p>
          Your program will need to read input data from the file <code>input.txt</code> and write
          output to the file <code>output.txt</code>.
        </p>
      )}
      <p>
        Make sure your code does not contain debug messages or unnecessary output, as they could
        compromise the correct evaluation of the solution. For example, messages like &laquo;
        <i>Enter the number N</i>&raquo; are not needed.
      </p>
      <p>
        {io !== "grader" &&
          "The problem statement contains a detailed description of the input and output format; make sure to follow it exactly. "}
        Often, a template is also provided among the attachments, which implements only the
        input/output handling and can serve as a starting point.
      </p>
    </div>
  );
}
