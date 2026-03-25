import React from "react";

export const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center mt-10">

            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Text */}
            <p className="mt-4 text-lg font-medium animate-pulse">
                Loading, please wait...
            </p>

        </div>
    );
};