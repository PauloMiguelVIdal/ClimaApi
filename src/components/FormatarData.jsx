import React from 'react';
import { formatarData } from './utils/formatarData';

function DataFormatada({ dataISO }) {
  return <span>{formatarData(dataISO)}</span>;
}

// Exemplo de uso
export default function formatarData() {
  const dataDaAPI = "2025-05-23T00:00";
  return (
    <div>
     <DataFormatada dataISO={dataDaAPI} />
    </div>
  );
}