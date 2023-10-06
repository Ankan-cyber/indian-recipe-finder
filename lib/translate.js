export default function translate() {
    // Load Google Translate API
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            { pageLanguage: 'en', autoDisplay: false },
            'google_translate_element'
        );
    };
    window.addEventListener('load', () => {

        const div = document.querySelector('.goog-te-gadget');

        const keepEl = div.querySelector('#\\:0\\.targetLanguage');

        const children = Array.from(div.children);

        const toRemove = children.filter(el => el !== keepEl);

        toRemove.forEach(el => el.remove());
        div.childNodes.forEach(node => {
            if (node.nodeType === 3) {
                div.removeChild(node);
            }
        });

    });
}