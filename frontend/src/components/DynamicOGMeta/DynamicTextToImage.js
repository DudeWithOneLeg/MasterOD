export default function dynamicTextImage({ text, width = 1280, height = 720 }) {

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set background
        ctx.fillStyle = '#18181B';
        ctx.fillRect(0, 0, width, height);

        // Set text properties
        ctx.font = '70px Poppins';
        ctx.fillStyle = '#3B82F6';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Draw text
        ctx.fillText(text + " Resources", width / 2, height / 2);

        // Convert canvas to image URL
        const imageUrl = canvas.toDataURL()

    return imageUrl
};
