import type { Task } from "~/lib/api/task";

export function HelpPl({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Jak działa wejście i wyjście</h2>
      {io === "grader" && (
        <>
          <p>
            To zadanie korzysta z graderów. Musisz zaimplementować funkcję zdolną do rozwiązania
            problemu; grader wywoła Twoją funkcję, automatycznie obsługując odczyt wejścia i zapis
            wyjścia.
          </p>
          <p>
            Więcej szczegółów znajdziesz w{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">przewodniku po graderach</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          To jest zadanie typu <i>output-only</i>. Wszystkie pliki wejściowe znajdziesz w
          załącznikach do zadania i musisz wygenerować dla każdego odpowiedni plik wyjściowy do
          przesłania. Nie trzeba przesyłać kodu źródłowego: możesz rozwiązać zadanie w dowolnym
          języku, bez ograniczeń czasowych i pamięciowych.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Twój program musi odczytywać dane wejściowe ze <code>stdin</code> i zapisywać dane
          wyjściowe do <code>stdout</code>.
          {taskType === "Communication" &&
            " Upewnij się, że opróżniasz bufor wyjściowy po każdej operacji."}
        </p>
      )}
      {io === "file" && (
        <p>
          Twój program musi odczytywać dane wejściowe z pliku <code>input.txt</code> i zapisywać
          dane wyjściowe do pliku <code>output.txt</code>.
        </p>
      )}
      <p>
        Upewnij się, że w Twoim kodzie nie ma komunikatów debugowania ani zbędnych danych
        wyjściowych, ponieważ mogą one zakłócić poprawną ocenę rozwiązania. Na przykład komunikaty
        takie jak &laquo;<i>Podaj liczbę N</i>&raquo; nie są potrzebne.
      </p>
      <p>
        {io !== "grader" &&
          "Treść zadania zawiera szczegółowy opis formatu wejścia i wyjścia; upewnij się, że dokładnie go przestrzegasz. "}
        Często w załącznikach znajduje się także szablon, który implementuje jedynie obsługę
        wejścia/wyjścia i może posłużyć jako punkt wyjścia.
      </p>
    </div>
  );
}
