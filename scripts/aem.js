export function decorateBlocks(main) {
    const blocks = main.querySelectorAll('.cards');

    blocks.forEach((block) => {
        block.classList.add('block');
    });
}

export async function loadBlocks(main) {
    const blocks = main.querySelectorAll('.cards');

    for (const block of blocks) {
        const {default: decorateCards} = await import(
            '../blocks/cards/cards.js'
            );

        decorateCards(block);
    }
}