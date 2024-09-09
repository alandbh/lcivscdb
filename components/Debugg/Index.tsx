"use client";
function Debugg({
    data,
    filter = "debugg",
    print = false,
}: {
    data: any;
    filter?: string;
    print?: boolean;
}) {
    console.log(filter, data);

    if (print) {
        return (
            <pre className="max-w-sm overflow-x-auto text-xs">
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    }

    return null;
}

export default Debugg;
