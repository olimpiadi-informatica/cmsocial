import type { Task } from "~/lib/api/task";

export function HelpEs({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Cómo funcionan la entrada y la salida</h2>
      {io === "grader" && (
        <>
          <p>
            Este problema utiliza evaluadores automáticos (graders). Deberás implementar una función
            capaz de resolver el problema; el evaluador llamará a tu función, manejando
            automáticamente la lectura de las entradas y la escritura de las salidas.
          </p>
          <p>
            Para más detalles, consulta la{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">guía dedicada a los evaluadores</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          Este es un problema de tipo <i>solo salida</i> (output-only). Encontrarás todas las
          entradas entre los archivos adjuntos del problema y deberás generar, para cada una, la
          salida correspondiente para enviar. No es necesario enviar el código fuente: puedes
          resolver el problema utilizando cualquier lenguaje, sin límites de tiempo o memoria.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Tu programa deberá leer los datos de entrada de <code>stdin</code> y escribir los datos de
          salida en <code>stdout</code>.
          {taskType === "Communication" &&
            " Asegúrate de vaciar la salida (flush) después de cada operación."}
        </p>
      )}
      {io === "file" && (
        <p>
          Tu programa deberá leer los datos de entrada del archivo <code>input.txt</code> y escribir
          los datos de salida en el archivo <code>output.txt</code>.
        </p>
      )}
      <p>
        Asegúrate de que tu código no contenga mensajes de depuración o salidas superfluas, ya que
        podrían comprometer la evaluación correcta de la solución. Por ejemplo, mensajes como
        &laquo;
        <i>Introduce el número N</i>&raquo; no son necesarios.
      </p>
      <p>
        {io !== "grader" &&
          "En el enunciado del problema encontrarás una descripción detallada del formato de entrada y salida; asegúrate de seguirlo exactamente. "}
        A menudo, también se proporciona una plantilla entre los archivos adjuntos, que implementa
        exclusivamente el manejo de entrada/salida y puede servir como punto de partida.
      </p>
    </div>
  );
}
