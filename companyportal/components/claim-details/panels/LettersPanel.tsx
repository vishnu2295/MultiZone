"use client";

import DocumentRow, {
  type ApiDocumentDownload,
} from "@/components/claim-details/panels/DocumentRow";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { ClaimLettersAndTemplates } from "@/lib/constants";
import { downloadBase64File } from "@/lib/utils/downloadFile";

export default function LettersPanel({ claimId }: { claimId: string }) {
  const { token } = useCompanyProfile();

  async function handleDownload(letter: (typeof ClaimLettersAndTemplates)[number]) {
    const response = await apiService.get<ApiDocumentDownload>(
      `/employer/GetLettersAndTemplates/${claimId}`,
      {
        token: token ?? undefined,
        params: { letterKey: letter.value },
      },
    );

    downloadBase64File(response.fileName, response.fileType, response.content);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Letters and Templates
      </h2>
      {ClaimLettersAndTemplates.map((letter) => (
        <DocumentRow
          key={letter.key}
          document={{ name: letter.key }}
          onDownload={() => handleDownload(letter)}
        />
      ))}
    </div>
  );
}
