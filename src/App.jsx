import { useState, useEffect } from 'react'
import './App.css'

const DHIKR_TYPES = [
  { name: 'SubhanAllah', arabic: 'سبحان الله', target: 33 },
  { name: 'Alhamdulillah', arabic: 'الحمد لله', target: 33 },
  { name: 'Allahu Akbar', arabic: 'الله أكبر', target: 33 },
  { name: 'La ilaha illallah', arabic: 'لا إله إلا الله', target: 100 },
  { name: 'Astaghfirullah', arabic: 'أستغفر الله', target: 100 },
  { name: 'Custom', arabic: 'تسبيح مخصص', target: 33 },
]

function App() {
  const [selectedDhikr, setSelectedDhikr] = useState(0)
  const [count, setCount] = useState(0)
  const [customTarget, setCustomTarget] = useState(33)
  const [totalCount, setTotalCount] = useState(() => parseInt(localStorage.getItem('dhikrTotal') || '0'))

  const currentDhikr = DHIKR_TYPES[selectedDhikr]
  const target = currentDhikr.name === 'Custom' ? customTarget : currentDhikr.target
  const progress = (count / target) * 100

  useEffect(() => {
    localStorage.setItem('dhikrTotal', totalCount.toString())
  }, [totalCount])

  const increment = () => {
    if (count < target) {
      setCount(count + 1)
      setTotalCount(totalCount + 1)
    }
  }

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1)
      setTotalCount(totalCount - 1)
    }
  }

  const reset = () => setCount(0)

  const resetTotal = () => {
    if (window.confirm('Are you sure you want to reset your total dhikr count to zero?')) {
      setTotalCount(0)
      localStorage.setItem('dhikrTotal', '0')
    }
  }

  const handleDhikrChange = (index) => {
    setSelectedDhikr(index)
    setCount(0)
    if (DHIKR_TYPES[index].name === 'Custom') {
      setCustomTarget(33)
    }
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px'}}>
      <div style={{textAlign: 'center', maxWidth: '500px', margin: '0 auto'}}>
        
        <h1 style={{fontSize: '2.5rem', marginBottom: '10px'}}>DhikrDaily</h1>
        <p style={{color: '#888'}}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        
        <div style={{margin: '30px 0', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
          {DHIKR_TYPES.map((dhikr, index) => (
            <button
              key={index}
              onClick={() => handleDhikrChange(index)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: selectedDhikr === index ? '#10b981' : 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {dhikr.name}
            </button>
          ))}
        </div>

        <div style={{margin: '30px 0'}}>
          <p style={{fontSize: '3rem', margin: '10px 0', color: '#10b981'}}>{currentDhikr.arabic}</p>
          <p style={{fontSize: '1.2rem', opacity: 0.8}}>{currentDhikr.name}</p>
        </div>

        {currentDhikr.name === 'Custom' && (
          <div style={{margin: '20px 0', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px'}}>
            <label style={{display: 'block', marginBottom: '8px', color: '#888'}}>Set Your Target:</label>
            <input
              type="number"
              value={customTarget}
              onChange={(e) => setCustomTarget(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '100px',
                padding: '10px',
                fontSize: '1.2rem',
                textAlign: 'center',
                borderRadius: '8px',
                border: '2px solid #10b981',
                background: 'rgba(255,255,255,0.1)',
                color: 'white'
              }}
            />
          </div>
        )}

        <div style={{width: '200px', height: '200px', margin: '30px auto', position: 'relative'}}>
          <svg width="200" height="200" style={{transform: 'rotate(-90deg)'}}>
            <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.1)" strokeWidth="15" fill="none"/>
            <circle 
              cx="100" cy="100" r="90" 
              stroke="#10b981" 
              strokeWidth="15" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
              style={{transition: 'all 0.3s'}}
            />
          </svg>
          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', fontWeight: 'bold'}}>
            {count}
          </div>
        </div>

        <p style={{color: '#888', marginBottom: '10px'}}>Target: {target}</p>
        {count >= target && (
          <p style={{color: '#10b981', marginBottom: '20px', fontWeight: 'bold'}}>✨ Completed! BarakAllah!</p>
        )}

        <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px'}}>
          <button onClick={decrement} style={buttonStyle}>−</button>
          <button 
            onClick={increment} 
            disabled={count >= target} 
            style={{...buttonStyle, width: '80px', height: '80px', fontSize: '2rem', background: count >= target ? '#555' : '#10b981'}}
          >
            +
          </button>
          <button onClick={reset} style={buttonStyle}>↺</button>
        </div>

        <div style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '20px'}}>
          <p style={{color: '#888'}}>Total Dhikr</p>
          <p style={{fontSize: '2rem', color: '#10b981', fontWeight: 'bold'}}>{totalCount.toLocaleString()}</p>
          <button 
            onClick={resetTotal}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              background: 'rgba(239,68,68,0.2)',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reset Total
          </button>
        </div>

        <p style={{color: '#666', fontSize: '0.9rem'}}>
          Made with ❤️ for the Ummah | Laylat al-Qadr 1447 AH
        </p>
      </div>
    </div>
  )
}

const buttonStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  fontSize: '1.5rem',
  cursor: 'pointer'
}

export default App
