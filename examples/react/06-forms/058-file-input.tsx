/**
 * 058 — File input
 * @tags forms
 * @difficulty medium
 *
 * ## Теория
 * input type=file — files в event.target.files. Controlled file input ограничен в React.
 *
 * ## На собеседовании
 * - Загрузка файлов? — FormData + fetch или presigned URL.
 */

import { useState } from 'react';

export function FilePicker() {
  const [name, setName] = useState('');
  return (
    <div>
      <input
        type="file"
        aria-label="File"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? '')}
      />
      <span data-testid="name">{name || 'none'}</span>
    </div>
  );
}
