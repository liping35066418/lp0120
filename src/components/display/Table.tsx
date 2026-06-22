import React from 'react'

interface TableProps {
  columns?: number
  rows?: number
  bordered?: boolean
  striped?: boolean
  styles?: Record<string, string>
}

const DisplayTable: React.FC<TableProps> = ({
  columns = 3,
  rows = 4,
  bordered = true,
  striped = true,
  styles = {},
}) => {
  const headers = Array.from({ length: columns }, (_, i) => `列标题 ${i + 1}`)
  const dataRows = Array.from({ length: rows }, (_, rowIdx) =>
    Array.from({ length: columns }, (_, colIdx) => `数据 ${rowIdx + 1}-${colIdx + 1}`)
  )

  return (
    <div className="w-full overflow-x-auto" style={styles}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-2.5 text-left font-medium text-gray-700 ${
                  bordered ? 'border border-gray-200' : 'border-b-2 border-gray-300'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={striped && rowIdx % 2 === 1 ? 'bg-gray-50/50' : ''}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={`px-4 py-2.5 text-gray-600 ${
                    bordered ? 'border border-gray-200' : 'border-b border-gray-100'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DisplayTable
