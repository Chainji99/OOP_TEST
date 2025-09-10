// ---------- Interface ----------
interface Borrowable {
    borrow(memberName: string): string;
    returnItem(): string;
    isAvailable(): boolean;
}

// ---------- Abstract Class ----------
abstract class LibraryItem implements Borrowable {
    private _title: string;
    protected _itemId: string;
    private _available: boolean;

    constructor(title: string, itemId: string) {
        this._title = title;
        this._itemId = itemId;
        this._available = true;
    }

    get title(): string {
        return this._title;
    }

    get itemId(): string {
        return this._itemId;
    }

    set available(status: boolean) {
        this._available = status;
    }

    isAvailable(): boolean {
        return this._available;
    }

    borrow(memberName: string): string {
        if (!this._available) {
            return `Item not available`;
        }
        this._available = false;
        return `${this._title} borrowed by ${memberName}`;
    }

    returnItem(): string {
        this._available = true;
        return `${this._title} returned`;
    }

    abstract getDetails(): string;
}

// ---------- Subclasses ----------
class Book extends LibraryItem {
    private _author: string;

    constructor(title: string, itemId: string, author: string) {
        super(title, itemId);
        this._author = author;
    }

    getDetails(): string {
        return `Book: ${this.title} by ${this._author} (ID: ${this.itemId})`;
    }
}

class Magazine extends LibraryItem {
    private _issueDate: string;

    constructor(title: string, itemId: string, issueDate: string) {
        super(title, itemId);
        this._issueDate = issueDate;
    }

    getDetails(): string {
        return `Magazine: ${this.title}, Issue: ${this._issueDate} (ID: ${this.itemId})`;
    }
}

class DVD extends LibraryItem {
    private _duration: number;

    constructor(title: string, itemId: string, duration: number) {
        super(title, itemId);
        this._duration = duration;
    }

    getDetails(): string {
        return `DVD: ${this.title}, Duration: ${this._duration} mins (ID: ${this.itemId})`;
    }
}

class Newspaper extends LibraryItem {
    private _date: string;

    constructor(title: string, itemId: string, date: string) {
        super(title, itemId);
        this._date = date;
    }

    getDetails(): string {
        return `Newspaper: ${this.title}, Date: ${this._date} (ID: ${this.itemId})`;
    }
}

class Thesis extends LibraryItem {
    private _researcher: string;

    constructor(title: string, itemId: string, researcher: string) {
        super(title, itemId);
        this._researcher = researcher;
    }

    getDetails(): string {
        return `Thesis: ${this.title} by ${this._researcher} (ID: ${this.itemId})`;
    }
}

// ---------- LibraryMember ----------
class LibraryMember {
    private _memberName: string;
    private _memberId: string;
    private _borrowedItems: LibraryItem[];

    constructor(memberName: string, memberId: string) {
        this._memberName = memberName;
        this._memberId = memberId;
        this._borrowedItems = [];
    }

    get memberName(): string {
        return this._memberName;
    }

    get memberId(): string {
        return this._memberId;
    }

    borrowItem(item: LibraryItem): string {
        const msg = item.borrow(this._memberName);
        if (msg !== "Item not available") {
            this._borrowedItems.push(item);
        }
        return msg;
    }

    returnItem(itemId: string): string {
        const index = this._borrowedItems.findIndex(i => i.itemId === itemId);
        if (index !== -1) {
            const item = this._borrowedItems[index];
            this._borrowedItems.splice(index, 1);
            return item.returnItem();
        }
        return `Item not found in borrowed list`;
    }

    listBorrowedItems(): string {
        if (this._borrowedItems.length === 0) {
            return "No borrowed items";
        }
        const books = this._borrowedItems.filter(i => i instanceof Book);
        const magazines = this._borrowedItems.filter(i => i instanceof Magazine);
        const dvds = this._borrowedItems.filter(i => i instanceof DVD);
        const newspapers = this._borrowedItems.filter(i => i instanceof Newspaper);
        const theses = this._borrowedItems.filter(i => i instanceof Thesis);

        let result: string[] = [];
        if (books.length > 0) {
            result.push("Books: " + books.map(i => i.getDetails()).join("; "));
        }
        if (magazines.length > 0) {
            result.push("Magazines: " + magazines.map(i => i.getDetails()).join("; "));
        }
        if (dvds.length > 0) {
            result.push("DVDs: " + dvds.map(i => i.getDetails()).join("; "));
        }
        if (newspapers.length > 0) {
            result.push("Newspapers: " + newspapers.map(i => i.getDetails()).join("; "));
        }
        if (theses.length > 0) {
            result.push("Theses: " + theses.map(i => i.getDetails()).join("; "));
        }
        return result.join(" | ");
    }

    countBorrowedItems(): number {
        return this._borrowedItems.length;
    }
}

// ---------- Library ----------
class Library {
    private items: LibraryItem[];
    private members: LibraryMember[];

    constructor() {
        this.items = [];
        this.members = [];
    }

    addItem(item: LibraryItem): void {
        this.items.push(item);
    }

    addMember(member: LibraryMember): void {
        this.members.push(member);
    }

    borrowItem(memberId: string, itemId: string): string {
        const member = this.members.find(m => m.memberId === memberId);
        const item = this.items.find(i => i.itemId === itemId);
        if (member && item) {
            return member.borrowItem(item);
        }
        return "Member or Item not found";
    }

    returnItem(memberId: string, itemId: string): string {
        const member = this.members.find(m => m.memberId === memberId);
        if (member) {
            return member.returnItem(itemId);
        }
        return "Member not found";
    }

    getLibrarySummary(): string {
        const itemsSummary = this.items.map(i => i.getDetails()).join("\n");
        const membersSummary = this.members
            .map(m => `${m.memberName} (Borrowed: ${m.countBorrowedItems()})`)
            .join(", ");
        return `Items:\n${itemsSummary}\n\nMembers:\n${membersSummary}`;
    }

    getMembersBorrowedItems(): string {
        return this.members
            .map(m => {
                // แยกแต่ละประเภทขึ้นบรรทัดใหม่
                const items = m.listBorrowedItems().replace(/ \| /g, '\n');
                return `${m.memberName}:\n${items}`;
            })
            .join("\n\n");
    }
}

// ---------- Example Usage ----------
const lib = new Library();
console.log("Library system initialized.");


const book = new Book("The Hobbit", "B001", "J.R.R. Tolkien");
const mag = new Magazine("National Geographic", "M001", "2023-01");
const dvd = new DVD("Inception", "D001", 148);

const book2 = new Book("1984", "B002", "George Orwell");
const mag2 = new Magazine("Time", "M002", "2023-02");
const dvd2 = new DVD("The Matrix", "D002", 136);

const book3 = new Book("To Kill a Mockingbird", "B003", "Harper Lee");
const mag3 = new Magazine("Scientific American", "M003", "2022-12");
const dvd3 = new DVD("Interstellar", "D003", 169);

const book4 = new Book("The Great Gatsby", "B004", "F. Scott Fitzgerald");
const mag4 = new Magazine("Forbes", "M004", "2023-03");
const dvd4 = new DVD("Avatar", "D004", 162);

const book5 = new Book("Moby Dick", "B005", "Herman Melville");
const mag5 = new Magazine("The New Yorker", "M005", "2023-03");
const dvd5 = new DVD("The Godfather", "D005", 175);

// ประกาศ Newspaper และ Thesis ก่อน addItem
const newspaper1 = new Newspaper("Bangkok Post", "N001", "2023-09-10");
const thesis1 = new Thesis("AI in Education", "T001", "Dr. Somchai");

const newspaper2 = new Newspaper("The Guardian", "N002", "2023-09-11");
const thesis2 = new Thesis("Climate Change Impacts", "T002", "Dr. Smith");

const newspaper3 = new Newspaper("The New York Times", "N003", "2023-09-12");
const thesis3 = new Thesis("Quantum Computing", "T003", "Dr. Johnson");

const newspaper4 = new Newspaper("Le Monde", "N004", "2023-09-13");
const thesis4 = new Thesis("Renewable Energy", "T004", "Dr. Brown");

const newspaper5 = new Newspaper("El País", "N005", "2023-09-14");
const thesis5 = new Thesis("Blockchain Technology", "T005", "Dr. Garcia");

// แล้วค่อย addItem
lib.addItem(book);
lib.addItem(mag);
lib.addItem(dvd);
lib.addItem(thesis1);
lib.addItem(newspaper1);

lib.addItem(book2);
lib.addItem(mag2);
lib.addItem(dvd2);

lib.addItem(book3);
lib.addItem(mag3);
lib.addItem(dvd3);

lib.addItem(book4);
lib.addItem(mag4);
lib.addItem(dvd4);

lib.addItem(book5);
lib.addItem(mag5);
lib.addItem(dvd5);

lib.addItem(newspaper1);
lib.addItem(thesis1);
lib.addItem(newspaper2);
lib.addItem(thesis2);
lib.addItem(newspaper3);
lib.addItem(thesis3);
lib.addItem(newspaper4);
lib.addItem(thesis4);
lib.addItem(newspaper5);
lib.addItem(thesis5);

const member = new LibraryMember("Alice", "M1001");
lib.addMember(member);


const member2 = new LibraryMember("Bob", "M1002");
lib.addMember(member2);

const member3 = new LibraryMember("Charlie", "M1003");
lib.addMember(member3);

const member4 = new LibraryMember("Diana", "M1004");
lib.addMember(member4);

const member5 = new LibraryMember("Eve", "M1005");
lib.addMember(member5);

// ตัวอย่างการยืมครบ 5 ประเภทสำหรับแต่ละสมาชิก
console.log(lib.borrowItem("M1001", "B001")); // Alice ยืม Book
console.log(lib.borrowItem("M1001", "M001")); // Alice ยืม Magazine
console.log(lib.borrowItem("M1001", "D001")); // Alice ยืม DVD
console.log(lib.borrowItem("M1001", "N001")); // Alice ยืม Newspaper
console.log(lib.borrowItem("M1001", "T001")); // Alice ยืม Thesis

console.log(lib.borrowItem("M1002", "B002")); // Bob ยืม Book
console.log(lib.borrowItem("M1002", "M002")); // Bob ยืม Magazine
console.log(lib.borrowItem("M1002", "D002")); // Bob ยืม DVD
console.log(lib.borrowItem("M1002", "N002")); // Bob ยืม Newspaper
console.log(lib.borrowItem("M1002", "T002")); // Bob ยืม Thesis

console.log(lib.borrowItem("M1003", "B003")); // Charlie ยืม Book
console.log(lib.borrowItem("M1003", "M003")); // Charlie ยืม Magazine
console.log(lib.borrowItem("M1003", "D003")); // Charlie ยืม DVD
console.log(lib.borrowItem("M1003", "N003")); // Charlie ยืม Newspaper
console.log(lib.borrowItem("M1003", "T003")); // Charlie ยืม Thesis

console.log(lib.borrowItem("M1004", "B004")); // Diana ยืม Book
console.log(lib.borrowItem("M1004", "M004")); // Diana ยืม Magazine
console.log(lib.borrowItem("M1004", "D004")); // Diana ยืม DVD
console.log(lib.borrowItem("M1004", "N004")); // Diana ยืม Newspaper
console.log(lib.borrowItem("M1004", "T004")); // Diana ยืม Thesis

console.log(lib.borrowItem("M1005", "B005")); // Eve ยืม Book
console.log(lib.borrowItem("M1005", "M005")); // Eve ยืม Magazine
console.log(lib.borrowItem("M1005", "D005")); // Eve ยืม DVD
console.log(lib.borrowItem("M1005", "N005")); // Eve ยืม Newspaper
console.log(lib.borrowItem("M1005", "T005")); // Eve ยืม Thesis


console.log("\n--- สรุปห้องสมุด ---");
console.log(lib.getLibrarySummary());

console.log("\n--- รายการที่ยืม ---");
console.log(lib.getMembersBorrowedItems());