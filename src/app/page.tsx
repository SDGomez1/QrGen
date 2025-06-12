"use client";

import { useState } from "react";
import QRCode from "qrcode";
import Logo from "@/assets/icons/Logo";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function HomePage() {
  const [inputData, setInputData] = useState<string>("");

  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const errorCorrectionLevels: {
    value: ErrorCorrectionLevel;
    label: string;
  }[] = [
    { value: "L", label: "Muy Bajo (7%)" },
    { value: "M", label: "Bajo (15%)" },
    { value: "Q", label: "Medio (25%)" },
    { value: "H", label: "Alto (30%)" },
  ];

  const handleGenerate = async () => {
    if (!inputData || inputData == "") {
      alert("Por favor, ingresa datos para generar el código QR.");
      setQrCodeUrl("");
      return;
    }

    try {
      const options = {
        errorCorrectionLevel: errorLevel,
        margin: 2,
        scale: 8,
        width: 256,
        color: { dark: "#000000", light: "#FFFFFF" },
      };

      const url = await QRCode.toDataURL(inputData, options);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Fallo al generar el código QR:", err);
      setQrCodeUrl("");
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    const safeFilename =
      inputData
        .substring(0, 20)
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase() || "codigo_qr";
    link.download = `${safeFilename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen ">
      <div className="px-4 h-16 flex items-center border-b w-full justify-center border-b-neutral-300">
        <Logo className="size-5 mr-2" />
        <h1 className="font-bold">Generador de QR Simple</h1>
      </div>
      <section className="flex justify-center items-center min-h-[calc(100vh-4rem)] w-full px-4 py-5">
        <div className="w-full max-w-md rounded-lg bg-white">
          {/* Entrada para los datos del Código QR */}
          <div className="mb-4">
            <label
              htmlFor="qr-data"
              className="mb-2 block font-semibold text-gray-700"
            >
              Datos para el QR
            </label>
            <input
              id="qr-data"
              type="text"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="ej: https://www.ejemplo.com"
              className="w-full rounded-md border border-gray-300 p-3 text-lg focus:ring focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Botones de opción para el Nivel de Corrección de Errores */}
          <div className="mb-6">
            <fieldset>
              <legend className="mb-2 block font-semibold text-gray-700">
                Nivel de Durabilidad
              </legend>
              <p className="text-sm text-gray-600 mb-2">
                El nivel de resistencia a error del QR, entre mas alto el QR
                podra seguir siendo escaneado incluso si se manchan o borran
                algunas zonas{" "}
              </p>
              <div className="flex flex-wrap justify-between gap-2">
                {errorCorrectionLevels.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-300 p-2 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 w-40"
                  >
                    <input
                      type="radio"
                      name="error-level"
                      value={value}
                      checked={errorLevel === value}
                      onChange={() => setErrorLevel(value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* --- NUEVO: Botón para generar el código QR --- */}
          <button
            onClick={handleGenerate}
            className="w-full rounded-lg bg-green-600 px-5 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
          >
            Generar Código QR
          </button>

          {qrCodeUrl && (
            <div className="mt-6 flex flex-col items-center border-t pt-6">
              <h2 className="mb-2 text-lg font-semibold text-gray-600">
                Tu Código QR
              </h2>
              <div className="rounded-lg border border-gray-200 bg-white p-2">
                <img src={qrCodeUrl} alt="Código QR generado" />
              </div>

              <button
                onClick={handleDownload}
                className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.293V3a1 1 0 112 0v8.293l1.293-1.586a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Descargar PNG
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
