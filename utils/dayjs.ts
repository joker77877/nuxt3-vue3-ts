import dayjs, { Dayjs } from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)
export { dayjs, Dayjs }
