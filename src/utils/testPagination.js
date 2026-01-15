const testPagination = async () => {
  const API_BASE = 'http://localhost:5000';
  
  console.log('Testing pagination...');
  
  try {
    console.log('\n1. Testing all clients:');
    const allResponse = await fetch(`${API_BASE}/clients`);
    const allClients = await allResponse.json();
    console.log('Total clients:', allClients.length);
    
    console.log('\n2. Testing paginated clients (page 1, limit 3):');
    const page1Response = await fetch(`${API_BASE}/clients?_page=1&_limit=3`);
    const page1Clients = await page1Response.json();
    const totalCount = page1Response.headers.get('X-Total-Count');
    console.log('Page 1 clients:', page1Clients.length);
    console.log('Total count header:', totalCount);
    console.log('Clients:', page1Clients.map(c => c.name));
    console.log('\n3. Testing paginated clients (page 2, limit 3):');
    const page2Response = await fetch(`${API_BASE}/clients?_page=2&_limit=3`);
    const page2Clients = await page2Response.json();
    console.log('Page 2 clients:', page2Clients.length);
    console.log('Clients:', page2Clients.map(c => c.name));
    
    console.log('\n4. Testing deals pagination:');
    const dealsResponse = await fetch(`${API_BASE}/deals?_page=1&_limit=5`);
    const deals = await dealsResponse.json();
    const dealsTotal = dealsResponse.headers.get('X-Total-Count');
    console.log('Deals page 1:', deals.length);
    console.log('Deals total:', dealsTotal);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testPagination();

export default testPagination;
