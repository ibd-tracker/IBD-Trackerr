import React, { useState } from "react";

const symptomOptions = [
  "Bloating",
  "Diarrhea",
  "Pain",
  "Nausea",
  "Fatigue",
  "Cramps",
];

function formatDate(date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  // Data stored as { [date]: array of entries }
  const [symptomData, setSymptomData] = useState({});
  const [foodData, setFoodData] = useState({});

  // Inputs for symptoms
  const [symptoms, setSymptoms] = useState("");
  const [painLevel, setPainLevel] = useState(0);
  const [notes, setNotes] = useState("");

  // Inputs for food
  const [food, setFood] = useState("");
  const [foodNotes, setFoodNotes] = useState("");
  const [foodSymptoms, setFoodSymptoms] = useState(
    symptomOptions.reduce((acc, symptom) => {
      acc[symptom] = false;
      return acc;
    }, {})
  );

  // Helpers to get entries for selected day
  const todaySymptomEntries = symptomData[selectedDate] || [];
  const todayFoodEntries = foodData[selectedDate] || [];

  // Add symptom entry for the day
  function handleAddSymptomEntry() {
    if (symptoms.trim() === "") return;
    const newEntry = {
      id: Date.now(),
      symptoms: symptoms.trim(),
      painLevel,
      notes: notes.trim(),
    };
    setSymptomData((prev) => {
      const prevEntries = prev[selectedDate] || [];
      return { ...prev, [selectedDate]: [...prevEntries, newEntry] };
    });
    setSymptoms("");
    setPainLevel(0);
    setNotes("");
  }

  // Add food entry for the day
  function handleAddFoodEntry() {
    if (food.trim() === "") return;
    const selectedSymptoms = symptomOptions.filter((sym) => foodSymptoms[sym]);
    const newEntry = {
      id: Date.now(),
      food: food.trim(),
      notes: foodNotes.trim(),
      symptoms: selectedSymptoms,
    };
    setFoodData((prev) => {
      const prevEntries = prev[selectedDate] || [];
      return { ...prev, [selectedDate]: [...prevEntries, newEntry] };
    });
    setFood("");
    setFoodNotes("");
    setFoodSymptoms(
      symptomOptions.reduce((acc, symptom) => {
        acc[symptom] = false;
        return acc;
      }, {})
    );
  }

  // Clear all symptom entries for the day
  function clearSymptoms() {
    setSymptomData((prev) => ({ ...prev, [selectedDate]: [] }));
  }

  // Clear all food entries for the day
  function clearFood() {
    setFoodData((prev) => ({ ...prev, [selectedDate]: [] }));
  }

  // Handle date change
  function handleDateChange(e) {
    setSelectedDate(e.target.value);
  }

  // Toggle checkbox for food symptoms
  function toggleFoodSymptom(symptom) {
    setFoodSymptoms((prev) => ({
      ...prev,
      [symptom]: !prev[symptom],
    }));
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "auto",
        padding: 30,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f7f9fc",
        color: "#333",
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#007acc" }}>
        IBD Daily Tracker
      </h1>

      {/* Date selector */}
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <label
          htmlFor="date"
          style={{ fontWeight: "600", marginRight: 10, fontSize: 16 }}
        >
          Select Date:
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={formatDate(new Date())}
          style={{
            padding: 8,
            fontSize: 16,
            borderRadius: 6,
            border: "1.5px solid #007acc",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Symptoms Tracker */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: 40,
        }}
      >
        <h2 style={{ color: "#007acc", marginBottom: 15 }}>Symptoms</h2>

        <label
          style={{ display: "block", marginBottom: 12, fontWeight: "600" }}
          htmlFor="symptomsInput"
        >
          Symptoms (e.g., pain, diarrhea, fatigue):
        </label>
        <input
          id="symptomsInput"
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 6,
            border: "1.5px solid #007acc",
            marginBottom: 20,
          }}
          placeholder="Describe symptoms"
        />

        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "600",
          }}
          htmlFor="painSlider"
        >
          Pain Level: {painLevel} / 10
        </label>
        <input
          id="painSlider"
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => setPainLevel(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 20 }}
        />

        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "600",
          }}
          htmlFor="notesInput"
        >
          Notes (optional):
        </label>
        <textarea
          id="notesInput"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 6,
            border: "1.5px solid #007acc",
            resize: "vertical",
            minHeight: 80,
            marginBottom: 20,
          }}
          placeholder="Any other info"
        />

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={handleAddSymptomEntry}
            style={{
              backgroundColor: "#007acc",
              color: "#fff",
              padding: "12px 25px",
              fontSize: 16,
              fontWeight: "600",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              flex: 1,
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#005f99")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007acc")
            }
          >
            Add Entry
          </button>
          <button
            onClick={clearSymptoms}
            style={{
              backgroundColor: "#cc3300",
              color: "#fff",
              padding: "12px 25px",
              fontSize: 16,
              fontWeight: "600",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              flex: 1,
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#992500")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#cc3300")
            }
          >
            Clear All Symptoms
          </button>
        </div>

        <h3 style={{ color: "#005f99" }}>Entries</h3>
        {todaySymptomEntries.length === 0 && <p>No symptom entries yet.</p>}
        <ul style={{ paddingLeft: 20 }}>
          {todaySymptomEntries.map(({ id, symptoms, painLevel, notes }) => (
            <li
              key={id}
              style={{
                marginBottom: 15,
                backgroundColor: "#e6f2ff",
                padding: 15,
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>Symptoms:</strong> {symptoms}
              </p>
              <p>
                <strong>Pain Level:</strong>{" "}
                <span style={{ color: "#cc3300", fontWeight: "700" }}>
                  {painLevel} / 10
                </span>
              </p>
              {notes && (
                <p>
                  <strong>Notes:</strong> {notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Food Journal */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ color: "#007acc", marginBottom: 15 }}>Food Journal</h2>

        <label
          style={{ display: "block", marginBottom: 12, fontWeight: "600" }}
          htmlFor="foodInput"
        >
          Food eaten:
        </label>
        <input
          id="foodInput"
          type="text"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 6,
            border: "1.5px solid #007acc",
            marginBottom: 20,
          }}
          placeholder="Enter food or meal"
        />

        <label
          style={{ display: "block", marginBottom: 8, fontWeight: "600" }}
          htmlFor="foodNotesInput"
        >
          Notes (optional):
        </label>
        <textarea
          id="foodNotesInput"
          value={foodNotes}
          onChange={(e) => setFoodNotes(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 6,
            border: "1.5px solid #007acc",
            resize: "vertical",
            minHeight: 80,
            marginBottom: 20,
          }}
          placeholder="Any reactions or thoughts"
        />

        <fieldset
          style={{
            border: "1.5px solid #007acc",
            borderRadius: 6,
            padding: 10,
            marginBottom: 20,
          }}
        >
          <legend style={{ fontWeight: "600", color: "#007acc" }}>
            Symptoms after eating (check all that apply):
          </legend>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 8,
            }}
          >
            {symptomOptions.map((symptom) => (
              <label
                key={symptom}
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  flexBasis: "45%",
                }}
              >
                <input
                  type="checkbox"
                  checked={foodSymptoms[symptom]}
                  onChange={() => toggleFoodSymptom(symptom)}
                  style={{ marginRight: 6 }}
                />
                {symptom}
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={handleAddFoodEntry}
            style={{
              backgroundColor: "#007acc",
              color: "#fff",
              padding: "12px 25px",
              fontSize: 16,
              fontWeight: "600",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              flex: 1,
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#005f99")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007acc")
            }
          >
            Add Food Entry
          </button>
          <button
            onClick={clearFood}
            style={{
              backgroundColor: "#cc3300",
              color: "#fff",
              padding: "12px 25px",
              fontSize: 16,
              fontWeight: "600",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              flex: 1,
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#992500")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#cc3300")
            }
          >
            Clear All Food
          </button>
        </div>

        <h3 style={{ color: "#005f99", marginTop: 30 }}>Food Entries</h3>
        {todayFoodEntries.length === 0 && <p>No food entries yet.</p>}
        <ul style={{ paddingLeft: 20 }}>
          {todayFoodEntries.map(({ id, food, notes, symptoms }) => (
            <li
              key={id}
              style={{
                marginBottom: 15,
                backgroundColor: "#e6f2ff",
                padding: 15,
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>Food:</strong> {food}
              </p>
              {symptoms.length > 0 && (
                <p>
                  <strong>Symptoms after eating:</strong> {symptoms.join(", ")}
                </p>
              )}
              {notes && (
                <p>
                  <strong>Notes:</strong> {notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
