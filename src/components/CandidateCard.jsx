import { colorMap, initials } from "../utils/helpers";

const CandidateCard = ({ candidate, selected, voted, locked, onSelect }) => {

  const col = colorMap[candidate.partyColorTheme] || colorMap.sw1;

  const cardClass = `
    relative overflow-hidden rounded-2xl border-[1.5px] p-5 cursor-pointer
    transition-all duration-200
    ${voted ? 'border-green-500 bg-green-50 cursor-default' : ''}
    ${locked ? 'border-purple-100 opacity-50 cursor-not-allowed' : ''}
    ${selected && !voted && !locked ? 'border-blue-500 bg-blue-50' : ''}
    ${!selected && !voted && !locked ? 'border-purple-100 bg-white hover:border-blue-400 hover:-translate-x-0 hover:translate-x-1 hover:shadow-sm' : ''}
  `;

  return (
    <div className={cardClass} onClick={() => !locked && !voted && onSelect(candidate)}>
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-colors duration-200 ${voted ? 'bg-green-500' : selected ? 'bg-blue-500' : 'bg-transparent'}`} />

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl shrink-0" style={{ background: col.bg, color: col.tc }}>
          {initials(candidate.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[18px] text-gray-900">{candidate.name}</span>
            {
              voted && (
                <span className="badge bg-green-100 text-green-700 text-[10px]">✓ Your Vote</span>
              )
            }
            {
              locked && (
                <span className="badge bg-red-100 text-red-600 text-[10px]">🔒 Locked</span>
              )
            }
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{candidate.partySymbol} {candidate.partyName}</p>
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            <span className="tag">{candidate.partyName}</span>
            {
              candidate.qualifications && candidate.qualifications !== '—' && (
                <span className="tag">{candidate.qualifications}</span>
              )
            }
            {
              candidate.age && (
                <span className="tag">Age {candidate.age}</span>
              )
            }
          </div>
        </div>

        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200
          ${voted ? 'border-green-500 bg-green-500' : ''}
          ${selected && !voted ? 'border-blue-500 bg-blue-500' : ''}
          ${!selected && !voted ? 'border-purple-200' : ''}
        `}>
          {(selected || voted) && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateCard;