using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Services;

internal sealed class SecurityService : ISecurityService
{
    public bool IsValidPdf(IFormFile file)
    {
        // Check file extension
        if (Path.GetExtension(file.FileName).ToLower() != ".pdf")
            return false;

        // Check PDF magic number (%PDF-)
        try
        {
            using var stream = file.OpenReadStream();
            var header = new byte[4];
            stream.ReadExactly(header, 0, 4);
            return header[0] == 0x25 && // %
                   header[1] == 0x50 && // P
                   header[2] == 0x44 && // D
                   header[3] == 0x46; // F
        }
        catch
        {
            return false;
        }
    }

    public bool IsFileSizeValid(IFormFile file)
    {
        return file.Length <= StorageConstants.MaxFileSize;
    }

    public async Task<bool> IsFileSafeFromMalware(IFormFile file)
    {
        /* [!] Development check only. Should be replaced with <<ClamAV>> container in the production environment */
        try
        {
            await using var stream = file.OpenReadStream();
            using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var pdfReader = new PdfReader(memoryStream);
            using var pdfDocument = new PdfDocument(pdfReader);

            var catalog = pdfDocument.GetCatalog().GetPdfObject();
            if (catalog.ContainsKey(PdfName.OpenAction) || catalog.ContainsKey(PdfName.AA))
            {
                var openAction = catalog.Get(PdfName.OpenAction);
                if (openAction is PdfDictionary actionDict)
                    if (actionDict.ContainsKey(PdfName.JS) ||
                        actionDict.Get(PdfName.S)?.Equals(PdfName.JavaScript) == true)
                        return false;
            }

            for (var i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
            {
                var page = pdfDocument.GetPage(i);
                var annots = page.GetPdfObject().GetAsArray(PdfName.Annots);
                if (annots == null) continue;
                foreach (var annot in annots)
                {
                    var annotDict = (PdfDictionary)annot;
                    if (!annotDict.ContainsKey(PdfName.A) && !annotDict.ContainsKey(PdfName.AA)) continue;
                    var action = annotDict.GetAsDictionary(PdfName.A) ?? annotDict.GetAsDictionary(PdfName.AA);
                    if (action != null && (action.ContainsKey(PdfName.JS) ||
                                           action.Get(PdfName.S)?.Equals(PdfName.JavaScript) == true))
                        return false;
                }
            }

            var names = catalog.GetAsDictionary(PdfName.Names);
            if (names != null && names.ContainsKey(PdfName.EmbeddedFiles))
                return false;

            for (var i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
            {
                var page = pdfDocument.GetPage(i);
                var content = PdfTextExtractor.GetTextFromPage(page);
                if (content.Contains("/JavaScript", StringComparison.OrdinalIgnoreCase) ||
                    content.Contains("/JS", StringComparison.OrdinalIgnoreCase))
                    return false;
            }

            return true;
        }
        catch
        {
            return false;
        }
    }
}