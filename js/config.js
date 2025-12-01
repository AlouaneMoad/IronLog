        // --- 1. CONFIGURATION --- 
        const firebaseConfig = { 
            apiKey: "AIzaSyCe26zORpR8t-B2nGMcni4vdYgfIhSYpTI", 
            authDomain: "gym-v-1.firebaseapp.com", 
            projectId: "gym-v-1", 
            storageBucket: "gym-v-1.firebasestorage.app", 
            messagingSenderId: "417567716746", 
            appId: "1:417567716746:web:a6f29a16839dc42e7e8473", 
            measurementId: "G-G6NLMY47T1" 
        }; 
 
        const RANKS = ["Bronze", "Silver", "Gold", "Diamond", "Hero", "Strongman", "Monster"]; 
        const EXERCISES = [ 
            { id: 'bp', name: 'Bench Press', muscle: 'Chest', diff: 1.5 }, 
            { id: 'sq', name: 'Barbell Squat', muscle: 'Legs', diff: 2.0 }, 
            { id: 'dl', name: 'Deadlift', muscle: 'Back', diff: 2.2 }, 
            { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', diff: 1.8 }, 
            { id: 'pu', name: 'Pull Ups', muscle: 'Back', diff: 1.5 }, 
            { id: 'lu', name: 'Lunges', muscle: 'Legs', diff: 1.4 } 
        ]; 
