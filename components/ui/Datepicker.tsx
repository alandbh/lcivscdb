"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function Datepicker({
    className,
    onSelectDate,
}: {
    className?: string;
    onSelectDate: any;
}) {
    const [date, setDate] = React.useState<Date>();
    const [selectedDate, setSelectedDate] = React.useState<Date>();
    const [popOverOpen, setPopOverOpen] = React.useState<boolean>(false);

    function handleOnSelect(newDate: Date | undefined) {
        setDate(newDate);
        // setSelectedDate(newDate);
        onSelectDate(newDate);
    }

    function closePopover() {
        setPopOverOpen(false);
    }

    return (
        <Popover open={popOverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                    onClick={() => setPopOverOpen(true)}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP", { locale: ptBR })
                    ) : (
                        <span>Escolha uma data</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0"
                onPointerDownOutside={closePopover}
                onEscapeKeyDown={closePopover}
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                        handleOnSelect(date);
                        closePopover();
                    }}
                    initialFocus
                    defaultMonth={date}
                />
            </PopoverContent>
        </Popover>
    );
}
