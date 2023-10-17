export default function TableSkeleton({ n }: { n: number }) {
  return (
    <>
      <tr
        role="status"
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 animate-pulse"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </th>

        {Array.from({ length: n }).map((_, i) => (
          <td key={i} className="px-6 py-4">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          </td>
        ))}
      </tr>
    </>
  );
}
