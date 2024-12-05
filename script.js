// Default data
const defaultData = [
    ["Kepulauan Selayar", 10.79, 468755, 14.94, 32.1, 6.53, 420, 2],
    ["Bulukumba", 6.71, 422111, 28.6, 28.4, 8.58, 880, 1],
    ["Bantaeng", 8.26, 434664, 15.8, 22.1, 13.35, 402, 2],
    ["Jeneponto", 11.82, 416231, 43.9, 39.8, 16.28, 778, 2],
    ["Takalar", 7.75, 455793, 23.51, 31.3, 10.26, 626, 3],
    ["Gowa", 6.85, 475305, 55.13, 33.0, 7.98, 1190, 3],
    ["Sinjai", 7.82, 412441, 19.4, 29.4, 9.31, 614, 1],
    ["Maros", 9.32, 530070, 34.0, 30.1, 7.68, 718, 2],
    ["Pangkep", 12.41, 439192, 42.94, 34.2, 4.41, 868, 3],
    ["Barru", 8.31, 417396, 14.64, 14.1, 6.71, 494, 1],
    ["Bone", 9.58, 423727, 73.03, 27.8, 7.75, 1682, 4],
    ["Soppeng", 6.9, 411958, 15.9, 26.9, 5.81, 608, 1],
    ["Wajo", 6.47, 431291, 26.57, 28.6, 9.33, 964, 3],
    ["Sidrap", 5.02, 458509, 15.48, 27.3, 5.48, 610, 4],
    ["Pinrang", 8.55, 414198, 33.04, 20.9, 4.62, 784, 4],
    ["Enrekang", 11.25, 427556, 24.06, 26.4, 6.87, 576, 2],
    ["Luwu", 11.7, 433898, 44.24, 26.7, 3.65, 818, 2],
    ["Tana Toraja", 10.79, 418308, 26.3, 35.4, 7.66, 640, 6],
    ["Luwu Utara", 11.24, 431980, 36.46, 29.8, 3.62, 682, 4],
    ["Luwu Timur", 6.55, 460356, 20.7, 22.6, 5.04, 492, 4],
    ["Toraja Utara", 10.73, 413029, 25.97, 34.1, 7.26, 572, 4],
    ["Makassar", 4.97, 592753, 79.53, 18.4, 0.85, 1680, 26],
    ["Pare Pare", 5.27, 467151, 7.94, 27.1, 2.6, 258, 4],
    ["Palopo", 7.35, 466521, 14.43, 23.8, 1.33, 240, 8],
];

// Weights and criteria types
const weights = [0.38140951, 0.197041679, 0.149136632, 0.095657271, 0.086157343, 0.053124051, 0.037473514];
const types = ["benefit", "benefit", "benefit", "benefit", "benefit", "cost", "cost"];

let currentData = JSON.parse(JSON.stringify(defaultData));

// Populate table
function populateTable(data) {
    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = "";
    data.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach((cell, colIndex) => {
            const td = document.createElement("td");
            if (colIndex === 0) {
                td.textContent = cell; // Alternatif name
            } else {
                const input = document.createElement("input");
                input.type = "number";
                input.value = cell;
                input.className = "w-full px-2 py-1 border rounded";
                input.onchange = (e) => {
                    currentData[rowIndex][colIndex] = parseFloat(e.target.value);
                };
                td.appendChild(input);
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Validasi data input
function validateInput() {
    let isValid = true;
    let errorMessage = "";
    const tableRows = document.querySelectorAll("#data-table tbody tr");

    tableRows.forEach((row, rowIndex) => {
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input, colIndex) => {
            const value = input.value.trim();

            // Pastikan kolom tidak kosong
            if (value === "") {
                isValid = false;
                errorMessage = "Nilai tidak boleh kosong.";
                input.classList.add("border-red-500");
            } else if (isNaN(value)) {
                // Pastikan nilai adalah angka
                isValid = false;
                errorMessage = "Nilai harus berupa angka.";
                input.classList.add("border-red-500");
            } else {
                const numValue = parseFloat(value);

                // Validasi khusus untuk kolom tertentu (C1, C4, dan C5) dalam rentang 0-100
                if ((colIndex === 0 || colIndex === 3 || colIndex === 4) && (numValue < 0 || numValue > 100)) {
                    isValid = false;
                    errorMessage = "Nilai untuk Persentase Penduduk Miskin, Prevalensi Stunting Menurut (Persen), dan Persentase Penduduk Usia 15 Tahun ke Atas yang Buta Huruf harus berada dalam rentang 0-100.";
                    input.classList.add("border-red-500");
                } else if (numValue < 0) {
                    // Validasi untuk memastikan semua nilai tidak kurang dari 0
                    isValid = false;
                    errorMessage = "Nilai tidak boleh kurang dari 0.";
                    input.classList.add("border-red-500");
                } else {
                    input.classList.remove("border-red-500");
                }
            }
        });
    });

    // Tampilkan pesan kesalahan jika tidak valid
    const output = document.querySelector("#output");
    if (!isValid) {
        output.innerHTML = `<p class="text-red-500 font-semibold">${errorMessage}</p>`;
        document.querySelector("#data-table").classList.add("border", "border-red-500");
    } else {
        output.innerHTML = ""; // Bersihkan pesan kesalahan
        document.querySelector("#data-table").classList.remove("border", "border-red-500");
    }

    return isValid;
}


// Normalisasi data
function normalize(data, weights) {
    const normalized = data.map(row => row.slice());
    for (let j = 1; j < data[0].length; j++) {
        const column = data.map(row => row[j]);
        const denominator = Math.sqrt(column.reduce((sum, val) => sum + val ** 2, 0));
        normalized.forEach(row => row[j] = (row[j] / denominator) * weights[j - 1]);
    }
    return normalized;
}

// Menghitung solusi ideal (positif dan negatif)
function calculateIdeal(normalized) {
    const idealPositive = Array(normalized[0].length).fill(0);
    const idealNegative = Array(normalized[0].length).fill(0);

    for (let j = 1; j < normalized[0].length; j++) {
        const column = normalized.map(row => row[j]);
        if (types[j - 1] === "benefit") {
            idealPositive[j] = Math.max(...column);
            idealNegative[j] = Math.min(...column);
        } else if (types[j - 1] === "cost") {
            idealPositive[j] = Math.min(...column);
            idealNegative[j] = Math.max(...column);
        }
    }

    return { positive: idealPositive, negative: idealNegative };
}

// Menghitung skor preferensi
function calculateScores(normalized, ideal) {
    const scores = normalized.map(row => {
        const distancePositive = Math.sqrt(row.slice(1).reduce((sum, val, j) => 
            sum + (val - ideal.positive[j + 1]) ** 2, 0));
        const distanceNegative = Math.sqrt(row.slice(1).reduce((sum, val, j) => 
            sum + (val - ideal.negative[j + 1]) ** 2, 0));
        const preference = distanceNegative / (distancePositive + distanceNegative);
        return { name: row[0], score: preference };
    });

    return scores.sort((a, b) => b.score - a.score);
}

// Menampilkan hasil dalam bentuk tabel
function displayResults(scores) {
    const output = document.querySelector("#output");

    // Hapus elemen hasil sebelumnya
    output.innerHTML = `
        <table id="result-table" class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
            <thead class="bg-blue-600 text-white">
                <tr>
                    <th class="px-4 py-2 border">Peringkat</th>
                    <th class="px-4 py-2 border">Kabupaten/Kota</th>
                    <th class="px-4 py-2 border">Skor Preferensi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200"></tbody>
        </table>
    `;

    const tbody = document.querySelector("#result-table tbody");

    // Iterasi hasil dan tambahkan baris ke tabel
    scores.forEach((score, index) => {
        const tr = document.createElement("tr");

        // Kolom Peringkat
        const rankTd = document.createElement("td");
        rankTd.textContent = index + 1;
        rankTd.className = "px-4 py-2 border";
        tr.appendChild(rankTd);

        // Kolom Kabupaten/Kota
        const nameTd = document.createElement("td");
        nameTd.textContent = score.name;
        nameTd.className = "px-4 py-2 border";
        tr.appendChild(nameTd);

        // Kolom Skor Preferensi
        const scoreTd = document.createElement("td");
        scoreTd.textContent = score.score.toFixed(4);
        scoreTd.className = "px-4 py-2 border";
        tr.appendChild(scoreTd);

        tbody.appendChild(tr);
    });

    // Tampilkan tombol download setelah hasil dihitung
    const downloadButton = document.querySelector("#download-btn");
    downloadButton.classList.remove("hidden");
    downloadButton.onclick = () => downloadCSV(scores); // Tambahkan event klik untuk unduhan
}

// Tombol Clear
document.querySelector("#clear-btn").addEventListener("click", () => {
    currentData.forEach(row => row.fill(0, 1));
    populateTable(currentData);
});

// Tombol Reset to Default
document.querySelector("#default-btn").addEventListener("click", () => {
    currentData = JSON.parse(JSON.stringify(defaultData));
    populateTable(currentData);
});

// Tombol Calculate TOPSIS
document.querySelector("#calculate-btn").addEventListener("click", () => {
    if (validateInput()) {
        const normalized = normalize(currentData, weights);
        const ideal = calculateIdeal(normalized);
        const scores = calculateScores(normalized, ideal);
        displayResults(scores);
    }
});

// Inisialisasi tabel
populateTable(defaultData);

// Fungsi untuk mengunduh hasil sebagai file CSV
function downloadCSV(scores) {
    // Buat header CSV
    const csvContent = [
        ["Peringkat", "Kabupaten/Kota", "Skor Preferensi"], // Header kolom
        ...scores.map((score, index) => [index + 1, score.name, score.score.toFixed(4)]) // Baris data
    ]
        .map(row => row.join(",")) // Gabungkan setiap elemen dengan koma
        .join("\n"); // Gabungkan setiap baris dengan newline

    // Buat elemen anchor untuk mengunduh
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "topsis_results.csv"); // Nama file unduhan
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
