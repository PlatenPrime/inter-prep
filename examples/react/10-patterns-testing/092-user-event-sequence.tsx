/**
 * 092 — userEvent sequence
 * @tags testing, user-event
 * @difficulty medium
 *
 * ## Теория
 * userEvent симулирует реальную цепочку pointer/keyboard events. Предпочтительнее fireEvent для интеграционных тестов.
 *
 * ## На собеседовании
 * - userEvent.setup()? — advanceTimers для fake timers.
 */

import { useState } from 'react';

export function PinForm() {
  const [pin, setPin] = useState('');
  const ok = pin.length === 4;
  return (
    <div>
      <input aria-label="PIN" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} />
      {ok && <p>OK</p>}
    </div>
  );
}
