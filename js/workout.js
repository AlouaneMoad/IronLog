        // --- 3. WORKOUT ENGINE --- 
        class WorkoutEngine { 
            constructor() { 
                this.active = null; 
                this.timerInterval = null; 
                this.restInterval = null; 
            } 
 
            startNew() { 
                this.active = { startTime: Date.now(), exercises: [] }; 
                document.getElementById('view-active-workout').classList.remove('hidden'); 
                this.startSessionTimer(); 
                this.renderActive(); 
            } 
 
            startPreset(type) { 
                this.startNew(); 
                if(type === 'Push') { this.addExercise('bp'); this.addExercise('ohp'); this.addExercise('dp'); }  
                else if (type === 'Pull') { this.addExercise('dl'); this.addExercise('pu'); }  
                else { this.addExercise('sq'); this.addExercise('lu'); } 
            } 
 
            startSessionTimer() { 
                const el = document.getElementById('session-timer'); 
                this.timerInterval = setInterval(() => { 
                    const diff = Math.floor((Date.now() - this.active.startTime) / 1000); 
                    const m = Math.floor(diff / 60).toString().padStart(2, '0'); 
                    const s = (diff % 60).toString().padStart(2, '0'); 
                    el.innerText = `${m}:${s}`; 
                }, 1000); 
            } 
 
            openExercisePicker() { 
                document.getElementById('modal-exercises').classList.remove('hidden'); 
                document.getElementById('exercise-list').innerHTML = EXERCISES.map(ex => ` 
                    <button onclick="workout.addExercise('${ex.id}'); document.getElementById('modal-exercises').classList.add('hidden')" class="w-full text-left glass p-4 rounded-xl flex items-center justify-between hover:bg-slate-800"> 
                        <div><div class="font-bold text-white">${ex.name}</div><div class="text-xs text-slate-400">${ex.muscle} • x${ex.diff} XP</div></div> 
                        <i data-lucide="plus-circle" class="text-emerald-400"></i> 
                    </button> 
                `).join(''); 
                if(window.lucide) lucide.createIcons(); 
            } 
 
            addExercise(id) { 
                const ref = EXERCISES.find(e => e.id === id); 
                this.active.exercises.push({ id: Date.now(), ...ref, sets: [] }); 
                this.renderActive(); 
            } 
 
            addSet(exIdx, weight, reps) { 
                if(!weight || !reps) return; 
                this.active.exercises[exIdx].sets.push({ weight: Number(weight), reps: Number(reps) }); 
                this.renderActive(); 
                this.startRestTimer(); 
            } 
 
            startRestTimer() { 
                const toast = document.getElementById('rest-timer-toast'); 
                const count = document.getElementById('rest-countdown'); 
                toast.classList.remove('hidden'); 
                let timeLeft = 90; 
                if(this.restInterval) clearInterval(this.restInterval); 
                this.restInterval = setInterval(() => { 
                    timeLeft--; 
                    const m = Math.floor(timeLeft / 60); 
                    const s = (timeLeft % 60).toString().padStart(2, '0'); 
                    count.innerText = `${m}:${s}`; 
                    if(timeLeft <= 0) { this.skipRest(); alert("Rest time over!"); } 
                }, 1000); 
            } 
 
            skipRest() { 
                clearInterval(this.restInterval); 
                document.getElementById('rest-timer-toast').classList.add('hidden'); 
            } 
 
            renderActive() { 
                const container = document.getElementById('active-exercises'); 
                if(this.active.exercises.length === 0) { 
                    container.innerHTML = `<div id="empty-workout" class="text-center py-20 opacity-50"><i data-lucide="dumbbell" class="w-16 h-16 mx-auto mb-4"></i><p>Add an exercise to start</p></div>`; 
                    return; 
                } 
                container.innerHTML = this.active.exercises.map((ex, exIdx) => ` 
                    <div class="glass p-4 rounded-xl"> 
                        <div class="flex justify-between items-center mb-3"><h3 class="font-bold text-lg">${ex.name}</h3></div> 
                        <div class="space-y-2 mb-3">${ex.sets.map((s, i) => `<div class="flex justify-between items-center bg-slate-900/50 p-2 rounded text-sm"><span class="text-slate-500 w-8">#${i+1}</span><span class="font-bold">${s.weight}kg</span><span class="font-bold text-slate-300">${s.reps} reps</span></div>`).join('')}</div> 
                        <div class="flex gap-2"> 
                            <input type="number" id="w-${exIdx}" placeholder="kg" class="w-20 bg-slate-800 border border-slate-600 rounded p-2 text-center text-white outline-none"> 
                            <input type="number" id="r-${exIdx}" placeholder="reps" class="w-20 bg-slate-800 border border-slate-600 rounded p-2 text-center text-white outline-none"> 
                            <button onclick="workout.addSet(${exIdx}, document.getElementById('w-${exIdx}').value, document.getElementById('r-${exIdx}').value)" class="flex-1 bg-emerald-600/20 text-emerald-400 font-bold rounded">LOG SET</button> 
                        </div> 
                    </div>`).join(''); 
                if(window.lucide) lucide.createIcons(); 
            } 
 
            async finish() { 
                if(this.active.exercises.length === 0) return this.close(); 
                document.getElementById('btn-finish-workout').innerText = "SAVING..."; 
 
                // 1. Calc XP 
                let sessionXP = 0, sessionVol = 0; 
                this.active.exercises.forEach(ex => { 
                    ex.sets.forEach(s => { 
                        const vol = s.weight * s.reps; 
                        sessionVol += vol; 
                        sessionXP += Math.floor((vol / 50) * ex.diff); 
                    }); 
                }); 
 
                // 2. Streak Logic 
                const now = new Date(); 
                let lastDate = new Date(0);  
                if (app.profile.lastWorkout && app.profile.lastWorkout.toDate) { 
                    lastDate = app.profile.lastWorkout.toDate(); 
                } 
 
                let streakBonus = 0; 
                let newStreak = app.profile.streak; 
 
                const isSameDay = now.toDateString() === lastDate.toDateString(); 
                if (!isSameDay) { 
                    const diffTime = Math.abs(now - lastDate); 
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    if (diffDays <= 2) { 
                        newStreak += 1; 
                        streakBonus = newStreak * 10; 
                    } else { 
                        newStreak = 1; 
                    } 
                } 
 
                const totalXP = sessionXP + streakBonus; 
                const newPoints = (app.profile.points || 0) + Math.floor(totalXP / 2); 
                const newTotalXP = (app.profile.xp || 0) + totalXP; 
                const newLevel = Math.floor(newTotalXP / 100); 
 
                // 3. Write to Firestore 
                try { 
                    const batch = app.db.batch(); 
                     
                    const workoutRef = app.db.collection('workouts').doc(); 
                    batch.set(workoutRef, { 
                        userId: app.user.uid, 
                        date: firebase.firestore.FieldValue.serverTimestamp(), 
                        volume: sessionVol, 
                        xpGained: totalXP, 
                        exercises: this.active.exercises 
                    }); 
 
                    const userRef = app.db.collection('users').doc(app.user.uid); 
                    batch.update(userRef, { 
                        xp: newTotalXP, 
                        points: newPoints, 
                        level: newLevel, 
                        streak: newStreak, 
                        lastWorkout: firebase.firestore.FieldValue.serverTimestamp() 
                    }); 
 
                    await batch.commit(); 
 
                    if (newLevel > app.profile.level) { 
                        confetti({ particleCount: 200 }); 
                        alert(`LEVEL UP! You are now level ${newLevel}`); 
                    } 
 
                    await app.loadProfile(app.user.uid); 
                    this.close(); 
                } catch (e) { 
                    alert("Error saving: " + e.message); 
                    this.close(); 
                } 
            } 
 
            close() { 
                clearInterval(this.timerInterval); 
                this.skipRest(); 
                document.getElementById('view-active-workout').classList.add('hidden'); 
                document.getElementById('btn-finish-workout').innerText = "FINISH"; 
                app.loadHistory(); 
            } 
        } 
