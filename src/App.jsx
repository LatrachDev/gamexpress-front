import './App.css'
import Main from './components/Main'
import Header from './components/header'
import Footer from './components/footer'
import Test from './components/test'
import { BrowserRouter , Routes , Route } from 'react-router-dom'

function App() {

  return (
      <div className="App">
      {
        <>
          <Main />
          <BrowserRouter>

            {/* <Header /> */}

            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/header" element={<Header />} />
              <Route path="/footer" element={<Footer />} />
              <Route path='/test' element={<Test />} />
            </Routes>

            {/* <Footer /> */}

          </BrowserRouter>
        </>
      }
      </div>
  )
}

export default App
