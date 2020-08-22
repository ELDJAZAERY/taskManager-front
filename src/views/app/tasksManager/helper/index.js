import { statuses } from '../data'

export const getIcon = (item) => {
    const mapping = statuses.find((si) => si.status === item.status);
    return mapping.icon
}