const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function testRazorpay() {
  try {
    console.log('Testing Razorpay with keys:');
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? '✓ Present' : '✗ Missing');
    
    const order = await razorpay.orders.create({
      amount: 1000, // ₹10
      currency: 'INR',
      receipt: 'test_receipt'
    });
    
    console.log('✅ Razorpay working! Order created:', order.id);
    console.log('Amount:', order.amount / 100, 'INR');
    
  } catch (error) {
    console.error('❌ Razorpay error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Wrong Key ID or Secret');
    console.log('2. Account not activated');
    console.log('3. Check if you\'re in Test Mode');
  }
}

testRazorpay();