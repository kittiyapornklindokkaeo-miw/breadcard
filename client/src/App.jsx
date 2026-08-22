import { Toaster } from "react-hot-toast"
import AppRoutes from "./routes/AppRoutes"

function App() {

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "font-itim",
        }}
      />
      <AppRoutes />
    </>

  )
}

export default App
