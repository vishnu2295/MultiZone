import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import type { ClaimDocumentGroup } from "@/content/claimDetails";

export default function DocumentsPanel({ groups }: { groups: ClaimDocumentGroup[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">Documents</h2>

      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {group.title}
          </h3>

          {group.documents.map((document) => (
            <DocumentRow key={document.name} document={document} />
          ))}
        </section>
      ))}
    </div>
  );
}
