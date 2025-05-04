import HomePage from './pages/HomePage'
import Description from './pages/Description'
import GetStarted from './pages/GetStarted'
import FAQ from './pages/FAQ'
import Footer from './components/Footer'
import NoteButton from './components/NoteButton'
import './styles/globals.css'

const App = () => {
  // More complex JavaScript code example for better visualization
  const currentCodeInEditor = `// Example JavaScript with multiple functions
function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + calculateItemPrice(item);
  }, 0);
}

function calculateItemPrice(item) {
  const basePrice = item.price * item.quantity;
  
  // Apply discount if applicable
  if (item.discountPercent > 0) {
    return applyDiscount(basePrice, item.discountPercent);
  }
  
  return basePrice;
}

function applyDiscount(amount, discountPercent) {
  const discountFactor = 1 - (discountPercent / 100);
  return roundToTwoDecimals(amount * discountFactor);
}

function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}

// Usage example
const cart = [
  { name: 'Laptop', price: 999.99, quantity: 1, discountPercent: 10 },
  { name: 'Mouse', price: 29.99, quantity: 2, discountPercent: 0 },
  { name: 'Keyboard', price: 59.99, quantity: 1, discountPercent: 15 }
];

const finalTotal = calculateTotal(cart);
console.log('Order Total: $' + finalTotal);`;

  return (
    <div className="relative overflow-hidden">
      {/* Main background for the entire app */}
      <div className="fixed inset-0 -z-20" style={{ 
        background: '#f8f5ed'  // Off-white background color
      }}/>
      
      <HomePage />
      <Description />
      <GetStarted />
      <FAQ />
      <Footer />
      
      {/* Note button that opens the modal */}
      <NoteButton codeEditorContent={currentCodeInEditor} />
    </div>
  )
}

export default App
