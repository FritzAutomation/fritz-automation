'use client';

export default function TestImage() {
  const testImageUrl = 'http://localhost:8000/media/projects/v-ie.png';

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Image Loading Test</h1>

      <div className="space-y-8">
        {/* Test 1: Regular img tag */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test 1: Regular &lt;img&gt; tag</h2>
          <img
            src={testImageUrl}
            alt="Test"
            className="w-64 h-64 object-cover border-2 border-gray-300"
            onError={(e) => {
              console.error('Image failed to load:', e);
              (e.target as HTMLImageElement).style.border = '3px solid red';
            }}
            onLoad={() => {
              console.log('Image loaded successfully!');
            }}
          />
          <p className="mt-2 text-sm text-gray-600">URL: {testImageUrl}</p>
        </div>

        {/* Test 2: Background image */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test 2: Background image</h2>
          <div
            className="w-64 h-64 bg-cover bg-center border-2 border-gray-300"
            style={{ backgroundImage: `url(${testImageUrl})` }}
          />
        </div>

        {/* Test 3: Direct link */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test 3: Direct link (should work)</h2>
          <a
            href={testImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Click here to open image in new tab
          </a>
        </div>

        {/* Console output */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Check Browser Console</h2>
          <p className="text-sm text-gray-600">
            Open DevTools (F12) and check the Console tab for any errors.
          </p>
        </div>
      </div>
    </div>
  );
}
