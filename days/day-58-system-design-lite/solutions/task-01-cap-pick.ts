export function capTradeoff(partition: boolean): string {
  return partition ? 'CP (consistency + partition tolerance)' : 'can choose AP or CP';
}
