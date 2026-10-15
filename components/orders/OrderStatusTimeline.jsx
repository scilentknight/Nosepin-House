import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
export function OrderStatusTimeline({ history }) {
    if (history.length === 0) {
        return <p className="text-sm text-gray-500">No status updates yet.</p>;
    }
    return (<ol className="space-y-3">
      {history.map((entry) => (<li key={entry.id} className="flex items-start gap-3 text-sm">
          <StatusBadge status={entry.status}/>
          <div className="min-w-0 flex-1">
            {entry.note && <p className="text-gray-700">{entry.note}</p>}
            <p className="text-xs text-gray-400">{formatDate(entry.createdAt)}</p>
          </div>
        </li>))}
    </ol>);
}
