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
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || "AI Error");
                }

                const data = await res.json();
                return data.text;
            })
    );
};

tinymce.init({
    selector: 'textarea.tinymce-editor, textarea#reply_message',
    license_key: 'gpl',
    base_url: '/admin/vendors/tinymce',
    suffix: '.min',
    height: 400,
    menubar: 'file edit view insert format tools table help',
    plugins: [
        'advlist', 'anchor', 'autolink', 'charmap', 'code', 'codesample',
        'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace',
        'table', 'visualblocks', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | emoticons charmap | removeformat | code',
    content_style: 'body { font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif; font-size:14px }',
    branding: false,
    promotion: false,
    automatic_uploads: false,
    ai_request
});
