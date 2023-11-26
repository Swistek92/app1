/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fetch from "node-fetch";

async function fetchImage(
    apiKey: string,
    templateId: string,
    data?: Record<string, any>,
    outputFormat = "image",
) {
    // Ustawiamy URL do endpointu Render API
    const url = "https://api.renderform.io/api/v2/render";

    // Tworzymy nagłówki HTTP z kluczem API
    const headers = {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
    };

    // Tworzymy ciało zapytania w formacie JSON
    const requestBody: Record<string, any> = {
        template: templateId,
        output: outputFormat,
    };

    // Jeśli dostarczono dane, dodajemy je do ciała zapytania
    if (data) {
        requestBody.data = data;
    }

    try {
        // Wysyłamy żądanie POST do API RenderForm
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
        });

        // Sprawdzamy, czy odpowiedź jest sukcesem (status HTTP 200)
        if (response.status === 200) {
            const responseData = await response.json();
            if (outputFormat === "image") {
                // Jeśli żądano obrazka, zwracamy URL do obrazka
                return responseData.href;
            } else if (outputFormat === "json") {
                // Jeśli żądano JSON, zwracamy JSON z danymi
                return JSON.stringify(responseData);
            }
        } else {
            // Jeśli odpowiedź nie jest sukcesem, zwracamy pusty string
            return "";
        }
    } catch (error) {
        console.error(`Błąd podczas pobierania obrazka: ${error}`);
        return "";
    }
}
export default fetchImage;

// Przykład użycia funkcji
