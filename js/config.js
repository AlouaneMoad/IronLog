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
            // ==== CHEST ====
            { 
                id: 'bp',
                name: 'Bench Press',
                muscle: 'Chest',
                diff: 1.5,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/WJrxtr--PCUAAAAj/workout-gym.gif',
                instructions: 'Lie on a flat bench with feet planted. Grip the bar slightly wider than shoulder-width. Lower the bar to mid-chest, then press it back up while keeping your shoulders tight.'
            },
            { 
                id: 'ibp',
                name: 'Incline Bench Press',
                muscle: 'Chest',
                diff: 1.6,
                difficulty: 'Intermediate',
                gif: 'https://media1.tenor.com/m/oMG7Qo3rgH4AAAAC/weight-bench-snapped-viralhog.gif',
                instructions: 'Set the bench to 30–45°. Grip the bar slightly wider than shoulder-width. Lower to upper chest and press back up, keeping chest up.'
            },
            { 
                id: 'dbp',
                name: 'Dumbbell Bench Press',
                muscle: 'Chest',
                diff: 1.4,
                difficulty: 'Beginner',
                gif: 'https://media1.tenor.com/m/ZKkJF-xtbhwAAAAd/dumbbell-press-exercise.gif',
                instructions: 'Lie on a bench with dumbbells above chest. Lower them with elbows at ~45° to your sides, then press back up and squeeze chest.'
            },
            { 
                id: 'cf',
                name: 'Cable Fly',
                muscle: 'Chest',
                diff: 1.3,
                difficulty: 'Beginner',
                gif: 'https://media1.tenor.com/m/RCF8FDtHjt8AAAAC/jay-cutler-pecho.gif',
                instructions: 'Stand between the cables. With a slight bend in elbows, bring hands together in front of chest in a wide arc. Squeeze, then return under control.'
            },
            { 
                id: 'pu',
                name: 'Push-Ups',
                muscle: 'Chest',
                diff: 1.1,
                difficulty: 'Beginner',
                gif: 'https://media1.tenor.com/m/WkfJelsEsU0AAAAd/captain-america-push-up.gif',
                instructions: 'Hands slightly wider than shoulders. Keep body straight. Lower chest toward floor, then push back up without letting hips sag.'
            },

            // ==== BACK ====
            { 
                id: 'dl',
                name: 'Deadlift',
                muscle: 'Back',
                diff: 2.2,
                difficulty: 'Advanced',
                gif: 'https://media.tenor.com/BzgAaVzQS2AAAAAM/deadlift.gif',
                instructions: 'Feet hip-width. Grip the bar outside your legs. Keep back flat, brace core, push the floor away and stand tall while keeping bar close to your body.'
            },
            {
                id: 'bbr',
                name: 'Barbell Row',
                muscle: 'Back',
                diff: 1.7,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/36hLhcn5UZ4AAAAM/bodybuilding-ronnie-coleman.gif',
                instructions: 'Hinge at hips with flat back. Pull bar toward lower ribs while keeping elbows close to your body. Lower the bar under control.'
            },
            {
                id: 'dbr',
                name: 'Dumbbell Row',
                muscle: 'Back',
                diff: 1.5,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/_XCUlWAGsWIAAAAM/dumbbell-row-heavy.gif',
                instructions: 'Support one hand and knee on a bench. Pull dumbbell toward your hip, squeezing the shoulder blade, then lower slowly.'
            },
            {
                id: 'lpd',
                name: 'Lat Pulldown',
                muscle: 'Back',
                diff: 1.4,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/xP8fvT1L8b4AAAAM/lat-pulldown-fail.gif',
                instructions: 'Grip the bar wider than shoulders. Pull bar to upper chest while keeping chest up. Control the bar on the way up.'
            },
            {
                id: 'plup',
                name: 'Pull-Ups',
                muscle: 'Back',
                diff: 1.7,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/L62Ej72hDmkAAAAM/cat-exercise.gif',
                instructions: 'Hang from bar with overhand grip. Pull your chest toward the bar by driving elbows down. Lower fully without swinging.'
            },

            // ==== SHOULDERS ====
            { 
                id: 'ohp',
                name: 'Overhead Press',
                muscle: 'Shoulders',
                diff: 1.8,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/mGVh7tR8fbwAAAA1/run-while-holding-dumbbells-daniel-labelle.webp',
                instructions: 'Stand with bar at shoulder height. Brace core and press bar overhead in a straight line. Lower to starting position with control.'
            },
            { 
                id: 'dsp',
                name: 'Dumbbell Shoulder Press',
                muscle: 'Shoulders',
                diff: 1.6,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/V6gKeRVVauoAAAAm/shoulders-shoulder-press.webp',
                instructions: 'Sit or stand with dumbbells at shoulder height. Press them overhead until arms are straight, then lower under control.'
            },
            { 
                id: 'latr',
                name: 'Lateral Raises',
                muscle: 'Shoulders',
                diff: 1.2,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/ZgtbXEZfHKsAAAAM/arnold-swarzshnegger.gif',
                instructions: 'Raise dumbbells to the sides until they reach shoulder height with a slight elbow bend. Lower slowly without swinging.'
            },

            // ==== LEGS ====
            { 
                id: 'sq',
                name: 'Barbell Squat',
                muscle: 'Legs',
                diff: 2.0,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/W0HUynuvKOcAAAAM/bongoz-squat.gif',
                instructions: 'Feet shoulder-width. Sit hips back and down until thighs are at least parallel. Push through mid-foot to stand tall.'
            },
            { 
                id: 'fsq',
                name: 'Front Squat',
                muscle: 'Legs',
                diff: 2.1,
                difficulty: 'Advanced',
                gif: 'https://media.tenor.com/VPaNCYd-jsoAAAAM/crossfit-lift.gif',
                instructions: 'Hold bar on front shoulders. Keep chest up and core tight. Squat down and stand back up without letting elbows drop.'
            },
            { 
                id: 'lu',
                name: 'Lunges',
                muscle: 'Legs',
                diff: 1.4,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/Fn7P-xCA3bYAAAAM/jack-black-sexy.gif',
                instructions: 'Step forward with one leg. Lower until both knees are about 90°. Push through front foot to return to start.'
            },
            { 
                id: 'rdl',
                name: 'Romanian Deadlift',
                muscle: 'Legs',
                diff: 1.8,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/mQ35v_u25cgAAAAM/record-world-record.gif',
                instructions: 'With a slight knee bend, hinge at hips while keeping back flat. Lower bar along thighs until you feel a hamstring stretch, then stand back up.'
            },
            { 
                id: 'ht',
                name: 'Hip Thrust',
                muscle: 'Legs',
                diff: 1.6,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/TcFWAjSqGrkAAAAM/my-sides-work-out.gif',
                instructions: 'Upper back on bench, feet flat. Drive hips up until body is straight from shoulders to knees. Squeeze glutes, then lower.'
            },

            // ==== ARMS – BICEPS ====
            { 
                id: 'bc',
                name: 'Barbell Curl',
                muscle: 'Biceps',
                diff: 1.3,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/bA7cBq_UJnMAAAAM/%D9%88%D9%82%D8%AA-%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9.gif',
                instructions: 'Stand tall with bar in hands. Curl bar up while keeping elbows close to your sides. Lower slowly without swinging.'
            },
            { 
                id: 'dbc',
                name: 'Dumbbell Curl',
                muscle: 'Biceps',
                diff: 1.2,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/jwt-pzK_tKIAAAAM/mike-barreras-curls.gif',
                instructions: 'Curl dumbbells up one or both arms at a time. Control the weight on the way back down.'
            },
            { 
                id: 'hc',
                name: 'Hammer Curl',
                muscle: 'Biceps',
                diff: 1.2,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/bXuGonfD-2cAAAAM/meathead-muscles.gif',
                instructions: 'Hold dumbbells with palms facing in. Curl while keeping elbows tight and wrists neutral.'
            },

            // ==== ARMS – TRICEPS ====
            { 
                id: 'tpd',
                name: 'Tricep Pushdown',
                muscle: 'Triceps',
                diff: 1.2,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/ww55an2tjpcAAAAM/tricep-pushdown-stephen-farrelly.gif',
                instructions: 'Grab cable bar/rope. Keep elbows at sides and extend arms down fully. Control the return.'
            },
            { 
                id: 'sc',
                name: 'Skull Crushers',
                muscle: 'Triceps',
                diff: 1.4,
                difficulty: 'Intermediate',
                gif: 'https://media.tenor.com/-Pq0I_p6kG0AAAAM/skulls.gif',
                instructions: 'Lie on a bench, hold bar above chest. Bend elbows to lower bar toward forehead, then extend back up.'
            },

            // ==== CORE ====
            { 
                id: 'plk',
                name: 'Plank',
                muscle: 'Core',
                diff: 1.0,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/TpTm9dQW9CsAAAAM/plank-plankguy.gif',
                instructions: 'Elbows under shoulders. Keep body in a straight line from head to heels. Brace core and hold.'
            },
            { 
                id: 'crn',
                name: 'Crunches',
                muscle: 'Core',
                diff: 1.0,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/g2-zU-AHquoAAAAM/cats-gym.gif',
                instructions: 'Lie on back with knees bent. Lift shoulders off the floor by contracting abs. Lower under control.'
            },
            { 
                id: 'legraise',
                name: 'Leg Raises',
                muscle: 'Core',
                diff: 1.1,
                difficulty: 'Beginner',
                gif: 'https://media.tenor.com/DS2odwIdTHcAAAAM/abdominal-workout-knee.gif',
                instructions: 'Lie on back, legs straight. Raise legs until vertical while keeping lower back pressed into the floor, then lower slowly.'
            }
        ];
