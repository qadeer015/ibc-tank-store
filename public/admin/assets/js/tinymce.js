

const ai_request = (request, respondWith) => {
    respondWith.string((signal) =>
        fetch("/api/ai/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: request.prompt
            }),
            signal
        })
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "AI Error");
                }

                const data = await res.json();
                return data.text;
            })
    );
};

tinymce.init({
    selector: 'textarea',
    plugins: [
        // Core editing features
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
        // Your account includes a free trial of TinyMCE premium features
        // Try the most popular premium features until Jan 11, 2026:
        'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | aidialog aishortcuts',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [{}],
    ai_request
});