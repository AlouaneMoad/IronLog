        // --- 2. MAIN APP --- 
        class IronLogApp { 
            constructor() { 
                this.user = null; 
                this.profile = null; 
                this.db = null; 
                this.auth = null; 
                this.chart = null; 
                this.init(); 
            } 
 
            init() { 
                if(window.lucide) lucide.createIcons(); 
                 
                if (!firebaseConfig.apiKey) { 
                    alert("⚠️ FIREBASE CONFIG MISSING!"); 
                    document.getElementById('global-loader').classList.add('hidden'); 
                    return; 
                } 
 
                firebase.initializeApp(firebaseConfig); 
                this.auth = firebase.auth(); 
                this.db = firebase.firestore(); 
 
                this.auth.onAuthStateChanged(async (u) => { 
                    if (u) { 
                        this.user = u; 
                        await this.loadProfile(u.uid); 
                    } else { 
                        document.getElementById('global-loader').classList.add('hidden'); 
                        this.showAuth(); 
                    } 
                }); 
            } 
 
            async loadProfile(uid) { 
                try { 
                    const docRef = await this.db.collection('users').doc(uid).get(); 
                    if (docRef.exists) { 
                        this.profile = docRef.data(); 
                        this.showApp(); 
                    } else { 
                        const defaultProfile = { 
                            uid: uid, 
                            name: this.user.displayName || "Unknown Hero", 
                            email: this.user.email, 
                            country: "USA",  
                            xp: 0, level: 1, rankTier: 'Bronze', 
                            streak: 0, lastWorkout: null, points: 0, 
                            createdAt: firebase.firestore.FieldValue.serverTimestamp() 
                        }; 
                        await this.db.collection('users').doc(uid).set(defaultProfile); 
                        this.profile = defaultProfile; 
                        this.showApp(); 
                    } 
                } catch (e) { 
                    console.error("Profile load failed", e); 
                    document.getElementById('global-loader').classList.add('hidden'); 
                    alert("Network/Permission Error: " + e.message + "\nPlease try again in a moment."); 
                } 
            } 
 
            showAuth() { 
                document.getElementById('view-auth').classList.remove('hidden'); 
                document.getElementById('view-app').classList.add('hidden'); 
                this.toggleAuth('login'); 
            } 
 
            showApp() { 
                document.getElementById('global-loader').classList.add('hidden'); 
                document.getElementById('view-auth').classList.add('hidden'); 
                document.getElementById('view-app').classList.remove('hidden'); 
                document.getElementById('view-app').classList.add('flex'); 
                this.refreshUI(); 
                this.loadHistory(); 
            } 
 
            // --- AUTH LOGIC --- 
            toggleAuth(mode) { 
                const nameInp = document.getElementById('inp-name'); 
                const countryInp = document.getElementById('inp-country'); 
                const btnLogin = document.getElementById('btn-mode-login'); 
                const btnSignup = document.getElementById('btn-mode-signup'); 
                const btnText = document.getElementById('auth-btn-text'); 
                const form = document.getElementById('auth-form'); 
 
                if (mode === 'signup') { 
                    nameInp.classList.remove('hidden'); 
                    countryInp.classList.remove('hidden'); 
                    btnLogin.className = "flex-1 py-2 rounded font-bold text-slate-500 transition-all"; 
                    btnSignup.className = "flex-1 py-2 rounded font-bold bg-slate-800 text-white transition-all"; 
                    btnText.innerText = "CREATE ACCOUNT"; 
                    form.onsubmit = (e) => this.handleSignup(e); 
                } else { 
                    nameInp.classList.add('hidden'); 
                    countryInp.classList.add('hidden'); 
                    btnLogin.className = "flex-1 py-2 rounded font-bold bg-slate-800 text-white transition-all"; 
                    btnSignup.className = "flex-1 py-2 rounded font-bold text-slate-500 transition-all"; 
                    btnText.innerText = "LOGIN"; 
                    form.onsubmit = (e) => this.handleLogin(e); 
                } 
            } 
 
            async handleSignup(e) { 
                e.preventDefault(); 
                document.getElementById('global-loader').classList.remove('hidden'); 
                const name = document.getElementById('inp-name').value; 
                const email = document.getElementById('inp-email').value; 
                const pass = document.getElementById('inp-pass').value; 
                const country = document.getElementById('inp-country').value; 
 
                try { 
                    const cred = await this.auth.createUserWithEmailAndPassword(email, pass); 
                    await cred.user.updateProfile({ displayName: name }); 
                    await this.db.collection('users').doc(cred.user.uid).set({ 
                        uid: cred.user.uid, 
                        name: name, 
                        email: email, 
                        country: country, 
                        xp: 0, level: 1, rankTier: 'Bronze', 
                        streak: 0, lastWorkout: null, points: 0, 
                        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
                    }); 
                } catch (err) { 
                    document.getElementById('global-loader').classList.add('hidden'); 
                    alert(err.message); 
                } 
            } 
 
            async handleLogin(e) { 
                e.preventDefault(); 
                document.getElementById('global-loader').classList.remove('hidden'); 
                const email = document.getElementById('inp-email').value; 
                const pass = document.getElementById('inp-pass').value; 
                try { 
                    await this.auth.signInWithEmailAndPassword(email, pass); 
                } catch (err) { 
                    document.getElementById('global-loader').classList.add('hidden'); 
                    alert(err.message); 
                } 
            } 
 
            logout() { 
                this.auth.signOut(); 
                this.user = null; 
                this.profile = null; 
                this.showAuth(); 
            } 
 
            // --- ACCOUNT DELETION (NEW) --- 
            async handleDeleteAccount() { 
                if(!confirm("⚠️ WARNING: This will permanently delete your account, workouts, and leaderboard ranking.\n\nAre you sure?")) return; 
                 
                document.getElementById('global-loader').classList.remove('hidden'); 
                 
                try { 
                    const uid = this.user.uid; 
                     
                    // 1. Delete Firestore Profile (Removes from Leaderboard) 
                    await this.db.collection('users').doc(uid).delete(); 
                     
                    // 2. Delete All Workouts (Clean up) 
                    const workouts = await this.db.collection('workouts').where('userId', '==', uid).get(); 
                    const batch = this.db.batch(); 
                    workouts.forEach(doc => batch.delete(doc.ref)); 
                    await batch.commit(); 
 
                    // 3. Delete Authentication 
                    await this.user.delete(); 
                     
                    alert("Account successfully deleted."); 
                    document.getElementById('global-loader').classList.add('hidden'); 
                    this.user = null; 
                    this.profile = null; 
                    this.showAuth(); 
                } catch (e) { 
                    document.getElementById('global-loader').classList.add('hidden'); 
                    alert("Error deleting account: " + e.message + "\n(You may need to logout and login again for security reasons)"); 
                } 
            } 
 
            // --- PROFILE MANAGEMENT --- 
            async handleUpdateName() { 
                const newName = document.getElementById('prof-name').value; 
                const btn = document.getElementById('btn-save-name'); 
                if(!newName) return alert("Enter a name"); 
                 
                btn.innerText = "SAVING..."; 
                try { 
                    await this.user.updateProfile({ displayName: newName }); 
                    await this.db.collection('users').doc(this.user.uid).update({ name: newName }); 
                    this.profile.name = newName; 
                    this.refreshUI(); 
                    alert("Name Updated!"); 
                } catch (e) { alert(e.message); } 
                btn.innerText = "UPDATE NAME"; 
            } 
 
            async handleUpdatePass() { 
                const newPass = document.getElementById('prof-pass').value; 
                const btn = document.getElementById('btn-save-pass'); 
                if(!newPass || newPass.length < 6) return alert("Password must be 6+ chars"); 
 
                btn.innerText = "UPDATING..."; 
                try { 
                    await this.user.updatePassword(newPass); 
                    document.getElementById('prof-pass').value = ''; 
                    alert("Password Changed Successfully!"); 
                } catch (e) { 
                    alert("Security Error: " + e.message + "\nTry logging out and logging back in."); 
                } 
                btn.innerText = "CHANGE PASSWORD"; 
            } 
 
            // --- UI & DATA --- 
            async refreshUI() { 
                if(!this.profile) return; 
                 
                document.getElementById('header-name').innerText = this.profile.name; 
                document.getElementById('header-avatar').src = `https://api.dicebear.com/7.x/initials/svg?seed=${this.profile.name}`; 
                document.getElementById('header-lvl-badge').innerText = this.profile.level; 
                document.getElementById('header-streak').innerText = this.profile.streak; 
                 
                // Profile Page Inputs 
                document.getElementById('prof-name').value = this.profile.name; 
                document.getElementById('prof-uid').innerText = this.user.uid; 
 
                const currentXP = this.profile.xp % 100; 
                document.getElementById('header-xp-bar').style.width = `${currentXP}%`; 
 
                const rankIdx = Math.floor(this.profile.level / 3); 
                const rankName = RANKS[Math.min(rankIdx, RANKS.length - 1)]; 
                const subRank = (this.profile.level % 3) || 3; 
                 
                const card = document.getElementById('card-rank'); 
                card.className = `glass p-6 rounded-2xl relative overflow-hidden border-t-4 rank-${rankName}`; 
                document.getElementById('dash-rank').innerText = `${rankName} ${subRank === 3 ? 'III' : (subRank === 2 ? 'II' : 'I')}`; 
                document.getElementById('dash-xp').innerText = `${currentXP} / 100 XP`; 
            } 
 
            async loadHistory() { 
                try { 
                    const snap = await this.db.collection('workouts') 
                        .where('userId', '==', this.user.uid) 
                        .orderBy('date', 'desc') 
                        .limit(10) 
                        .get(); 
 
                    const history = snap.docs.map(d => ({ id: d.id, ...d.data() })); 
                     
                    const totalVol = history.reduce((acc, h) => acc + (h.volume || 0), 0); 
                    document.getElementById('stat-vol').innerText = (totalVol/1000).toFixed(1) + 'k'; 
                    document.getElementById('stat-count').innerText = history.length; 
 
                    this.renderHistoryList(history); 
                    this.renderChart(history); 
                } catch (e) { 
                    console.log("History error:", e); 
                    document.getElementById('history-list').innerHTML = `<p class="text-red-500 text-xs p-4">Error loading history: ${e.message}</p>`;
                } 
            } 
 
            renderHistoryList(history) { 
                const list = document.getElementById('history-list'); 
                if(history.length === 0) { 
                    list.innerHTML = '<div class="text-center text-slate-500 py-10">No workouts yet. Start one!</div>'; 
                    return; 
                } 
                const latest = history[0]; 
                list.innerHTML = ` 
                    <p class="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">Last Workout</p> 
                    ${this.buildHistoryCard(latest)} 
                `; 
            } 
 
            renderChart(history) { 
                const ctx = document.getElementById('chart-activity').getContext('2d'); 
                if(this.chart) this.chart.destroy(); 
 
                const volumeByDay = history.reduce((acc, workout) => { 
                    const workoutDate = this.getWorkoutDate(workout.date); 
                    if(!workoutDate) return acc; 
                    const key = workoutDate.toDateString(); 
                    acc[key] = (acc[key] || 0) + (workout.volume || 0); 
                    return acc; 
                }, {}); 
 
                const labels = []; 
                const data = []; 
                const today = new Date(); 
                for(let i = 6; i >= 0; i--) { 
                    const day = new Date(today); 
                    day.setDate(today.getDate() - i); 
                    day.setHours(0,0,0,0); 
                    const key = day.toDateString(); 
                    labels.push(day.toLocaleDateString(undefined, { weekday: 'short' })); 
                    data.push(volumeByDay[key] || 0); 
                } 
 
                this.chart = new Chart(ctx, { 
                    type: 'line', 
                    data: { 
                        labels, 
                        datasets: [{ 
                            label: 'Volume', 
                            data, 
                            borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                            fill: true, tension: 0.4 
                        }] 
                    }, 
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: {display: false}}, scales: { x: {display: false}, y: {display:false} } } 
                }); 
            } 
 
            buildHistoryCard(workout) { 
                const exercises = (workout.exercises || []).map(ex => { 
                    const setCount = ex.sets ? ex.sets.length : 0; 
                    return `<div class="text-sm flex justify-between"><span class="text-white">${ex.name}</span><span class="text-slate-500">${setCount} sets</span></div>`; 
                }).join('') || '<div class="text-sm text-slate-500">No exercises logged.</div>'; 
 
                return ` 
                    <div class="glass p-4 rounded-xl"> 
                        <div class="flex justify-between items-center mb-2 border-b border-white/5 pb-2"> 
                            <span class="text-xs text-slate-400 font-bold">${this.formatWorkoutDate(workout.date)}</span> 
                            <span class="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-bold">+${workout.xpGained || 0} XP</span> 
                        </div> 
                        <div class="space-y-1"> 
                            ${exercises} 
                        </div> 
                    </div> 
                `; 
            } 
 
            formatWorkoutDate(dateField) { 
                const date = this.getWorkoutDate(dateField); 
                return date ? date.toLocaleDateString() : 'Today'; 
            } 
 
            getWorkoutDate(dateField) { 
                if(!dateField) return null; 
                if(typeof dateField.toDate === 'function') return dateField.toDate(); 
                if(typeof dateField.seconds === 'number') return new Date(dateField.seconds * 1000); 
                return new Date(dateField); 
            } 
 
            async loadLeaderboard(mode) { 
                document.getElementById('lb-loader').classList.remove('hidden'); 
                document.getElementById('lb-list').innerHTML = ''; 
                 
                document.getElementById('btn-lb-global').className = mode === 'global' ? "flex-1 py-2 rounded font-bold bg-slate-700 text-white text-sm" : "flex-1 py-2 rounded font-bold text-slate-500 text-sm"; 
                document.getElementById('btn-lb-country').className = mode === 'country' ? "flex-1 py-2 rounded font-bold bg-slate-700 text-white text-sm" : "flex-1 py-2 rounded font-bold text-slate-500 text-sm"; 
 
                let query = this.db.collection('users').orderBy('points', 'desc').limit(20); 
                if (mode === 'country' && this.profile.country) { 
                    query = this.db.collection('users').where('country', '==', this.profile.country).orderBy('points', 'desc').limit(20); 
                } 
 
                try { 
                    const snap = await query.get(); 
                    document.getElementById('lb-loader').classList.add('hidden'); 
                     
                    document.getElementById('lb-list').innerHTML = snap.docs.map((doc, i) => { 
                        const u = doc.data(); 
                        return ` 
                        <div class="glass p-3 rounded-xl flex items-center justify-between ${u.uid === this.user.uid ? 'border border-emerald-500' : ''}"> 
                            <div class="flex items-center gap-3"> 
                                <span class="font-rpg text-xl w-6 text-slate-500">#${i+1}</span> 
                                <div> 
                                    <div class="font-bold flex items-center gap-2">${u.name} <span class="text-[10px] bg-slate-800 px-1 rounded text-slate-400">${u.country}</span></div> 
                                    <div class="text-[10px] text-emerald-400 font-bold uppercase">${u.rankTier || 'Bronze'}</div> 
                                </div> 
                            </div> 
                            <div class="text-right font-bold text-white">${u.points} <span class="text-[10px] text-slate-500">PTS</span></div> 
                        </div>`; 
                    }).join(''); 
                } catch (e) { 
                    document.getElementById('lb-loader').innerHTML = `<p class="text-red-500 text-xs">Error: ${e.message}</p>`; 
                } 
            } 
 
            nav(tab) { 
                ['home', 'rank', 'history', 'profile'].forEach(t => { 
                    document.getElementById(`tab-${t}`).classList.add('hidden'); 
                    document.getElementById(`nav-${t}`).classList.remove('text-emerald-400'); 
                    document.getElementById(`nav-${t}`).classList.add('text-slate-500'); 
                }); 
                document.getElementById(`tab-${tab}`).classList.remove('hidden'); 
                document.getElementById(`nav-${tab}`).classList.add('text-emerald-400'); 
                if(tab === 'rank') this.loadLeaderboard('global'); 
            } 
        } 
