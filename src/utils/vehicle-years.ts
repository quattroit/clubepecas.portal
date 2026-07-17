/** Ano mínimo aceito para fabricação / modelo de veículo. */
export const VEHICLE_YEAR_MIN = 1950;

/** Ano máximo dinâmico: ano corrente + 1 (modelo futuro). */
export function getVehicleYearMax(now = new Date()): number {
  return now.getFullYear() + 1;
}

/** Lista de anos em ordem decrescente (max → min). */
export function listVehicleYears(now = new Date()): number[] {
  const max = getVehicleYearMax(now);
  const years: number[] = [];
  for (let year = max; year >= VEHICLE_YEAR_MIN; year -= 1) {
    years.push(year);
  }
  return years;
}

/** Exibe par fabricação/modelo, ex.: `2020/2021`. */
export function formatVehicleYears(
  manufacturingYear: number,
  modelYear: number,
): string {
  return `${manufacturingYear}/${modelYear}`;
}
