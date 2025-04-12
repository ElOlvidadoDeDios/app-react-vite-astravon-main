import { useAudio } from "../../../hooks/AudioContext";

export default function ActivitiesRadio() {
  const { isPlaying, playAudio, stopAudio } = useAudio();

  {/*return (
    <div className="text-center p-4 rounded  ">
      <h3 className="text-white mb-4 font-weight-bold">Astraradio</h3>
      <img
        src="https://play-lh.googleusercontent.com/0zh9QgHbkW1BT07WnagV8-LBcjg_e0Ek-XjIHushfQs4ot6BLiCgIrtT2mmSKNEHMZU"
        alt="Estación Astraradio"
        className="img-fluid mb-3 rounded-circle"
        style={{ width: "80px", height: "80px" }}
      />

      <p className="text-muted mb-4">La mejor radio online sobre ingeniería</p>

      <div className="my-4">
        <button
          className="btn btn-primary btn-lg  mx-2"
          onClick={playAudio}
          disabled={isPlaying}
        >
          Reproducir
        </button>
        <button
          className="btn btn-secondary btn-lg  mx-2"
          onClick={stopAudio}
          disabled={!isPlaying}
        >
          Detener
        </button>
      </div>

      <div className="text-left mt-4 px-2">
        <p className="text-justify">
          Bienvenido a <strong>Astraradio</strong>, tu estación de radio
          dedicada a la ingeniería. Aquí encontrarás información de vanguardia
          sobre construcción, entrevistas con los mejores ingenieros, podcasts
          innovadores y relatos inspiradores sobre emprendimiento e historias
          que están transformando el mundo de la ingeniería.
        </p>
        <p className=" mt-3">
          <strong>Contáctanos por WhatsApp:</strong> +51 911 3798-4360
        </p>
      </div>
    </div>
  );*/}
}
